import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
const files = execFileSync(
  'git',
  ['ls-files', '--cached', '--others', '--exclude-standard'],
  { encoding: 'utf8' },
)
  .trim()
  .split(/\r?\n/);
for (const file of files) {
  if (!existsSync(file)) continue;
  if (
    /^(server|scripts|test)\/.*\.js$/.test(file) ||
    file === 'blog/chess/app.js'
  )
    execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });
  if (/node_modules\//.test(file))
    throw new Error(`Dependency committed: ${file}`);
}
for (const file of ['blog/index.html', 'blog/chess/index.html']) {
  const html = readFileSync(file, 'utf8');
  for (const match of html.matchAll(/(?:href|src)="(\/[^"#]*)"/g)) {
    const url = match[1];
    if (url === '/' || url.startsWith('/assets/')) continue;
    const path = resolve('blog', url.slice(1));
    if (!existsSync(path))
      throw new Error(`Broken local link in ${file}: ${url}`);
  }
}
console.log('Syntax, first-party links and tracked dependency checks passed.');
