import { readFile, writeFile, mkdir, readdir, unlink, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readAuthoringData } from './data.mjs';
import { catalogFromTables } from '../../src/catalog.mjs';
import { jsonHtmlDocument, packImageFiles } from '../../src/gas-data.mjs';
import { build as bundle } from 'esbuild';
import { createGenerator } from 'unocss';
import { defineConfig } from '@tutorialkit/theme';
import { transformDirectives } from '@unocss/transformer-directives';
import MagicString from 'magic-string';
import { collectNotices } from './notices.mjs';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const read = name => readFile(path.join(root, name), 'utf8');
const safeJson = value => JSON.stringify(value).replaceAll('<', '\\u003c').replaceAll('\u2028', '\\u2028').replaceAll('\u2029', '\\u2029');

async function bundleClient() {
  const uno = createGenerator(defineConfig({}));
  const clientBundle = await bundle({
    entryPoints: [path.join(root, 'src/app.jsx')], outdir: path.join(root, 'dist/client'),
    bundle: true, write: false, format: 'iife', target: 'es2022', minify: true,
    jsx: 'automatic', legalComments: 'inline', metafile: true,
    define: { 'process.env.NODE_ENV': '"production"' },
    plugins: [{ name: 'tutorialkit-css', setup(build) {
      build.onLoad({ filter: /\.css$/ }, async ({ path: filename }) => {
        const css = new MagicString(await readFile(filename, 'utf8'));
        await transformDirectives(css, uno, {}, filename);
        return { contents: css.toString(), loader: filename.endsWith('.module.css') ? 'local-css' : 'css', resolveDir: path.dirname(filename) };
      });
    } }]
  });
  const browserModules = Object.keys(clientBundle.metafile.inputs);
  if (browserModules.some(name => /node_modules\/(?:@webcontainer\/|@tutorialkit\/runtime\/)/.test(name))) {
    throw new Error('ブラウザー配信にWebContainersの実行エンジンが混入しています。');
  }
  const sourceContent = await Promise.all(browserModules.filter(name => /\.[cm]?[jt]sx?$/.test(name)).map(name => readFile(path.resolve(root, name), 'utf8')));
  const utilities = await uno.generate(sourceContent.join('\n'), { preflights: true });
  const css = await read('node_modules/@unocss/reset/tailwind.css') + '\n' + utilities.css + '\n' + clientBundle.outputFiles.filter(file => file.path.endsWith('.css')).map(file => file.text).join('\n');
  const javascript = clientBundle.outputFiles.find(file => file.path.endsWith('.js')).text;
  return { css, javascript, browserModules };
}

export async function build() {
  const { imageFiles, ...tables } = await readAuthoringData();
  const catalog = catalogFromTables(tables);
  for (const quiz of catalog) for (const item of quiz.items) if (!item.grading) throw new Error(`採点条件がありません: ${item.id}`);
  const workerDom = await read('node_modules/linkedom/worker.js');
  const graderCode = await read('src/grader.mjs');
  const editorFilesCode = (await read('src/editor-files.mjs')).replace(/^export /gm, '');
  const uploadedFileCode = (await read('src/uploaded-file.mjs')).replace(/^export /gm, '');
  const imageData = {};
  for (const quiz of catalog) for (const image of quiz.images) {
    if (!/^images\/[\w.-]+\.(png|gif|jpg|jpeg|webp)$/.test(image.path)) throw new Error(`画像パスを確認してください: ${image.path}`);
    const file = imageFiles[image.path];
    if (!file) throw new Error(`画像ファイルがありません: ${image.path}`);
    const bytes = await readFile(file);
    const ext = path.extname(image.path).slice(1).replace('jpg', 'jpeg');
    imageData[image.path] = `data:image/${ext};base64,${bytes.toString('base64')}`;
  }
  const { css, javascript, browserModules } = await bundleClient();
  const notices = await collectNotices(root, browserModules);
  await writeFile(path.join(root, 'THIRD_PARTY_NOTICES.md'), notices);
  const workerSource = '/*\n' + notices.replaceAll('*/', '* /') + '\n*/\n' + workerDom.replace(/export \{[^}]+\};?\s*$/, '') + '\n' + editorFilesCode + '\n' + uploadedFileCode + '\n' + graderCode.replace(/^import .*;\n/gm, '').replace(/^export /gm, '') + `
self.onmessage = event => {
  const { item, answer, answers } = event.data;
  try { self.postMessage(gradeAnswer(item, answer, answers)); }
  catch(error) { self.postMessage({itemId:item.id,passed:false,feedback:error.message}); }
};`;
  const client = '/*\n' + notices.replaceAll('*/', '* /') + '\n*/\n' + javascript.replaceAll('</script', '<\\/script');
  const [index, server, submissionCode, gasDataCode] = await Promise.all([
    read('src/index.html'), read('src/gas/Code.gs'),
    read('src/submission.mjs'), read('src/gas-data.mjs')
  ]);
  const app = path.join(root, 'dist/app');
  await mkdir(app, { recursive: true });
  await rm(path.join(root, 'dist/sheets'), { recursive: true, force: true });
  const existing = await readdir(app);
  await Promise.all(existing.filter(name => /^(Catalog|Images\d+)\.html$/.test(name)).map(name => unlink(path.join(app, name))));
  const packedImages = packImageFiles(imageData);
  const catalogHtml = jsonHtmlDocument('Catalog', { catalog, imageFiles: packedImages.index });
  const shared = [editorFilesCode, uploadedFileCode, gasDataCode, submissionCode].join('\n').replace(/^import .*;\n/gm, '').replace(/^export /gm, '');
  const outputs = {
    'Index.html': index, 'Styles.html': `<style>\n${css}\n</style>`,
    'Client.html': `<script>\n${client}\n</script>`,
    'Grader.html': `<script type="application/json" id="grader-source">${safeJson(workerSource)}</script>`,
    'Catalog.html': catalogHtml,
    'Code.gs': `${shared}\n${server}`,
    'appsscript.json': await read('src/gas/appsscript.json')
  };
  for (const file of packedImages.files) outputs[`${file.name}.html`] = file.html;
  await Promise.all(Object.entries(outputs).map(([name, value]) => writeFile(path.join(app, name), value)));
  const previewHtml = index.replace("<?!= include_('Styles'); ?>", () => outputs['Styles.html'])
    .replace("<?!= include_('Grader'); ?>", () => outputs['Grader.html'])
    .replace("<?!= include_('Client'); ?>", () => `<script>window.PRACTICE_PREVIEW=${safeJson({ catalog, imageData })};</script>\n${outputs['Client.html']}`);
  return { catalog, tables, imageData, app, previewHtml, browserModules, imageFiles: packedImages };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { catalog, app, imageFiles } = await build();
  console.log(`${catalog.length}件のレッスンをビルドしました。GAS用ファイル: ${app}`);
  console.log(`問題データは Catalog.html と画像ファイル ${imageFiles.files.length} 個に埋め込みました。`);
}
