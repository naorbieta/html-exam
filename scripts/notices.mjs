import { readFile, readdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

// Match notices to the code and icon artwork actually shipped to the browser.
export async function collectNotices(root, browserModules) {
  const packages = new Map();
  async function addPackage(filename, dependencies = false) {
    let directory = path.dirname(filename);
    while (directory.startsWith(root) && directory !== root) {
      let pkg;
      try { pkg = JSON.parse(await readFile(path.join(directory, 'package.json'), 'utf8')); } catch {}
      if (pkg?.name) {
        if (packages.has(pkg.name)) return;
        const names = await readdir(directory);
        const licenses = names.filter(name => /^(licen[cs]e|copying)(\.|$)/i.test(name));
        if (!licenses.length) throw new Error(`ライセンス本文がありません: ${pkg.name}`);
        packages.set(pkg.name, (await Promise.all(licenses.map(name => readFile(path.join(directory, name), 'utf8')))).join('\n'));
        if (dependencies) {
          const require = createRequire(path.join(directory, 'package.json'));
          for (const name of Object.keys(pkg.dependencies || {})) await addPackage(require.resolve(name), true);
        }
        return;
      }
      directory = path.dirname(directory);
    }
  }
  for (const filename of browserModules.filter(name => name.includes('node_modules/'))) await addPackage(path.resolve(root, filename));
  await addPackage(path.join(root, 'node_modules/linkedom/worker.js'), true);
  packages.set('Phosphor Icons', await readFile(path.join(root, 'vendor/licenses/phosphor.txt'), 'utf8'));
  packages.set('UnoCSS reset', await readFile(path.join(root, 'vendor/licenses/unocss.txt'), 'utf8'));
  packages.set('TutorialKit (adapted UI sources)', await readFile(path.join(root, 'vendor/tutorialkit/LICENSE'), 'utf8'));
  return [...packages].sort(([a], [b]) => a.localeCompare(b)).map(([name, license]) => `# ${name}\n\n${license.trim()}`).join('\n\n---\n\n') + '\n';
}
