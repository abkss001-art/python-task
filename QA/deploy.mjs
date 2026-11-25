import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const envArg = process.argv.find((a) => a.startsWith('--env='));
const targetEnv = envArg ? envArg.slice('--env='.length).trim().toLowerCase() : '';

if (targetEnv !== 'staging' && targetEnv !== 'prod') {
  console.error('ERROR: Must specify target environment explicitly!');
  console.error('  Staging (Pre-Prod): npm run deploy:staging  (or: node deploy.mjs --env=staging)');
  console.error('  Production (Live):  npm run deploy:prod     (or: node deploy.mjs --env=prod)');
  process.exit(1);
}

const isStaging = targetEnv === 'staging';
const distDir = path.resolve(process.cwd(), 'dist');
const assetsDir = path.join(distDir, 'assets');

if (!fs.existsSync(distDir) || !fs.existsSync(assetsDir)) {
  console.error('ERROR: dist/ not found. Build first before deploying.');
  process.exit(1);
}

// 1. Cross-environment safety guard: inspect built JS bundles so Prod and Staging can NEVER be swapped!
const jsFiles = fs.readdirSync(assetsDir).filter((f) => f.endsWith('.js'));
const bundleText = jsFiles
  .map((f) => fs.readFileSync(path.join(assetsDir, f), 'utf8'))
  .join('\n');

const hasStagingDb = bundleText.includes('tzavman-qa-staging-default-rtdb');
const hasProdDb = bundleText.includes('tzavman-qa-default-rtdb');
const hasStagingBannerText = bundleText.includes('Pre-Prod');

if (isStaging) {
  if (!hasStagingDb || hasProdDb || !hasStagingBannerText) {
    console.error(
      'SAFETY BLOCK: dist/ does NOT look like a clean Staging build (must include tzavman-qa-staging-default-rtdb & Pre-Prod banner, and MUST NOT include tzavman-qa-default-rtdb). Run `npm run build:staging` first!'
    );
    process.exit(1);
  }
} else {
  if (!hasProdDb || hasStagingDb) {
    console.error(
      'SAFETY BLOCK: dist/ does NOT look like a clean Production build (must include tzavman-qa-default-rtdb and MUST NOT include tzavman-qa-staging-default-rtdb). Run `npm run build` first!'
    );
    process.exit(1);
  }
  const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
  if (indexHtml.includes('[Pre-Prod]')) {
    console.error(
      'SAFETY BLOCK: dist/index.html contains [Pre-Prod] branding! Refusing to deploy a Staging build to Production.'
    );
    process.exit(1);
  }
}

// 2. Ensure dist/404.html, dist/.nojekyll, and environment-specific manifest.json
fs.copyFileSync(path.join(distDir, 'index.html'), path.join(distDir, '404.html'));
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

if (isStaging) {
  const manifestPath = path.join(distDir, 'manifest.json');
  if (fs.existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      manifest.name = 'צב מן - סביבת בדיקות (Pre-Prod)';
      manifest.short_name = 'צב מן בדיקות';
      manifest.theme_color = '#d97706';
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
    } catch {
      // ignore manifest patch failure
    }
  }
}

// 3. Read package version & current git commit for clear release commit messages
let pkgVersion = '1.0.0';
try {
  pkgVersion = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8')).version || '1.0.0';
} catch {
  // ignore
}
let gitSha = 'unknown';
try {
  gitSha = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
} catch {
  // ignore
}

// 4. Clone gh-pages to isolated temp directory
const tempDir = path.join(os.tmpdir(), `gh-pages-${targetEnv}-${Date.now()}`);
console.log(`Cloning gh-pages to ${tempDir} (target: ${targetEnv.toUpperCase()})`);
execSync(
  `git clone --branch gh-pages --depth 1 https://github.com/abkss001-art/python-task.git "${tempDir}"`,
  { stdio: 'inherit' }
);

if (isStaging) {
  // Replace ONLY tempDir/staging/ — Production root files stay 100% untouched!
  const stagingDir = path.join(tempDir, 'staging');
  if (fs.existsSync(stagingDir)) {
    fs.rmSync(stagingDir, { recursive: true, force: true });
  }
  fs.mkdirSync(stagingDir, { recursive: true });
  fs.cpSync(distDir, stagingDir, { recursive: true });
  // Keep root .nojekyll intact
  if (!fs.existsSync(path.join(tempDir, '.nojekyll'))) {
    fs.writeFileSync(path.join(tempDir, '.nojekyll'), '');
  }
} else {
  // Replace Production root files while STRICTLY preserving .git AND staging/!
  const files = fs.readdirSync(tempDir);
  for (const file of files) {
    if (file === '.git' || file === 'staging') continue;
    fs.rmSync(path.join(tempDir, file), { recursive: true, force: true });
  }
  fs.cpSync(distDir, tempDir, { recursive: true });
}

// 5. Commit and push to gh-pages
execSync('git add -A', { cwd: tempDir, stdio: 'inherit' });
const commitMsg = isStaging
  ? `deploy(staging): Pre-Prod v${pkgVersion} (${gitSha})`
  : `deploy(prod): Production release v${pkgVersion} (${gitSha})`;

try {
  execSync(`git commit -m "${commitMsg}"`, { cwd: tempDir, stdio: 'inherit' });
  execSync('git push origin gh-pages', { cwd: tempDir, stdio: 'inherit' });
  console.log(
    isStaging
      ? 'Successfully deployed Pre-Prod (Staging) to https://abkss001-art.github.io/python-task/staging/'
      : 'Successfully deployed Production (Prod) to https://abkss001-art.github.io/python-task/'
  );
} catch (e) {
  console.log('No changes or commit/push note:', e.message);
}

// 6. Cleanup temp directory
try {
  fs.rmSync(tempDir, { recursive: true, force: true });
} catch {
  // ignore
}
