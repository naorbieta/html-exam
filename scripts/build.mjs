import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readAuthoringData } from './data.mjs';
import { catalogFromTables } from '../src/catalog.mjs';
import { build as bundle } from 'esbuild';
import { createGenerator } from 'unocss';
import { defineConfig } from '@tutorialkit/theme';
import { transformDirectives } from '@unocss/transformer-directives';
import MagicString from 'magic-string';
import { collectNotices } from './notices.mjs';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = name => readFile(path.join(root, name), 'utf8');
const safeJson = value => JSON.stringify(value).replaceAll('<', '\\u003c').replaceAll('\u2028', '\\u2028').replaceAll('\u2029', '\\u2029');

export async function build() {
  const tables = await readAuthoringData();
  const catalog = catalogFromTables(tables);
  for (const quiz of catalog) for (const item of quiz.items) if (!item.grading) throw new Error(`採点条件がありません: ${item.id}`);
  const workerDom = await read('node_modules/linkedom/worker.js');
  const graderCode = await read('src/grader.mjs');
  const editorFilesCode = (await read('src/editor-files.mjs')).replace(/^export /gm, '');
  const uploadedFileCode = (await read('src/uploaded-file.mjs')).replace(/^export /gm, '');
  const imageData = {};
  for (const quiz of catalog) for (const image of quiz.images) {
    if (!/^images\/[\w.-]+\.(png|gif|jpg|jpeg|webp)$/.test(image.path)) throw new Error(`画像パスを確認してください: ${image.path}`);
    const bytes = await readFile(path.join(root, image.path));
    const ext = path.extname(image.path).slice(1).replace('jpg', 'jpeg');
    imageData[image.path] = `data:image/${ext};base64,${bytes.toString('base64')}`;
  }
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
  const notices = await collectNotices(root, browserModules);
  await writeFile(path.join(root, 'THIRD_PARTY_NOTICES.md'), notices);
  const workerSource = '/*\n' + notices.replaceAll('*/', '* /') + '\n*/\n' + workerDom.replace(/export \{[^}]+\};?\s*$/, '') + '\n' + editorFilesCode + '\n' + uploadedFileCode + '\n' + graderCode.replace(/^import .*;\n/gm, '').replace(/^export /gm, '') + `
self.onmessage = event => {
  const { item, answer, answers } = event.data;
  try { self.postMessage(gradeAnswer(item, answer, answers)); }
  catch(error) { self.postMessage({itemId:item.id,passed:false,feedback:error.message}); }
};`;
  const client = '/*\n' + notices.replaceAll('*/', '* /') + '\n*/\n' + javascript.replaceAll('</script', '<\\/script');
  const [index, server, catalogCode, submissionCode, authoringCode] = await Promise.all([
    read('src/index.html'), read('gas/Code.gs'),
    read('src/catalog.mjs'), read('src/submission.mjs'), read('src/authoring.mjs')
  ]);
  const gas = path.join(root, 'dist/gas');
  const preview = path.join(root, 'dist/preview');
  await Promise.all([mkdir(gas, { recursive: true }), mkdir(preview, { recursive: true })]);
  const shared = [editorFilesCode, uploadedFileCode, authoringCode, catalogCode, submissionCode].join('\n').replace(/^import .*;\n/gm, '').replace(/^export /gm, '');
  const outputs = {
    'Index.html': index, 'Styles.html': `<style>\n${css}\n</style>`,
    'Client.html': `<script>\n${client}\n</script>`,
    'Grader.html': `<script type="application/json" id="grader-source">${safeJson(workerSource)}</script>`,
    'Data.html': safeJson(tables), 'Images.html': safeJson(imageData),
    'Code.gs': `${shared}\n${server}`,
    'appsscript.json': await read('gas/appsscript.json')
  };
  await Promise.all(Object.entries(outputs).map(([name, value]) => writeFile(path.join(gas, name), value)));
  const previewHtml = index.replace("<?!= include_('Styles'); ?>", () => outputs['Styles.html'])
    .replace("<?!= include_('Grader'); ?>", () => outputs['Grader.html'])
    .replace("<?!= include_('Client'); ?>", () => `<script>window.PRACTICE_PREVIEW=${safeJson({ catalog, imageData })};</script>\n${outputs['Client.html']}`);
  await writeFile(path.join(preview, 'index.html'), previewHtml);
  return { catalog, tables, imageData, gas, preview, browserModules };
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { catalog, gas } = await build();
  console.log(`${catalog.length}件の問題をビルドしました。GAS用ファイル: ${gas}`);
}
