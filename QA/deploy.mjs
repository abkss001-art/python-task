import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

// 1. Ensure dist/404.html and dist/.nojekyll exist
fs.copyFileSync('dist/index.html', 'dist/404.html');
fs.writeFileSync('dist/.nojekyll', '');

// 2. Temp directory
const tempDir = path.join(os.tmpdir(), `gh-pages-${Date.now()}`);
console.log('Cloning gh-pages to', tempDir);
execSync(`git clone --branch gh-pages --depth 1 https://github.com/abkss001-art/python-task.git "${tempDir}"`, { stdio: 'inherit' });

// 3. Delete old files except .git
const files = fs.readdirSync(tempDir);
for (const file of files) {
  if (file === '.git') continue;
  fs.rmSync(path.join(tempDir, file), { recursive: true, force: true });
}

// 4. Copy dist files
fs.cpSync('dist', tempDir, { recursive: true });

// 5. Commit and push
execSync(`git add -A`, { cwd: tempDir, stdio: 'inherit' });
try {
  execSync(`git commit -m "Deploy latest dark mode modal fixes and contrast improvements"`, { cwd: tempDir, stdio: 'inherit' });
  execSync(`git push origin gh-pages`, { cwd: tempDir, stdio: 'inherit' });
  console.log('Successfully deployed to gh-pages!');
} catch (e) {
  console.log('No changes or commit/push note:', e.message);
}

// 6. Cleanup
try {
  fs.rmSync(tempDir, { recursive: true, force: true });
} catch {
  // ignore
}
