import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const packageJsonPath = path.join(repoRoot, 'package.json');
const siteIndexPath = path.join(repoRoot, 'site', 'dist', 'index.html');
const siteFallbackPath = path.join(repoRoot, 'site', 'dist', '404.html');
const siteGalleryIndexPath = path.join(repoRoot, 'site', 'dist', 'gallery', 'index.html');
const llmsTxtPath = path.join(repoRoot, 'site', 'dist', 'llms.txt');
const llmsFullTxtPath = path.join(repoRoot, 'site', 'dist', 'llms-full.txt');

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const html = fs.readFileSync(siteIndexPath, 'utf8');
const fallbackHtml = fs.readFileSync(siteFallbackPath, 'utf8');
const galleryHtml = fs.readFileSync(siteGalleryIndexPath, 'utf8');
const llmsTxt = fs.readFileSync(llmsTxtPath, 'utf8');
const llmsFullTxt = fs.readFileSync(llmsFullTxtPath, 'utf8');
const homepage = packageJson.homepage;
const homepageUrl = new URL(homepage);
const basePath = homepageUrl.pathname.endsWith('/') ? homepageUrl.pathname : `${homepageUrl.pathname}/`;
const llmsFullUrl = new URL('llms-full.txt', homepage).toString();

const requiredPatterns = [
  /<meta[^>]+name="description"/,
  /<meta[^>]+name="theme-color"/,
  /<link[^>]+rel="canonical"/,
  /<meta[^>]+property="og:title"/,
  /<meta[^>]+property="og:description"/,
  /<meta[^>]+property="og:url"/,
  /<meta[^>]+name="twitter:card"/,
];

for (const pattern of requiredPatterns) {
  if (!pattern.test(html)) {
    throw new Error(`Missing required site metadata pattern: ${pattern}`);
  }
}

if (!html.includes(`href="${homepage}"`)) {
  throw new Error(`Expected canonical homepage URL ${homepage} in built site output.`);
}

if (!html.includes(`content="${homepage}"`)) {
  throw new Error(`Expected Open Graph site URL ${homepage} in built site output.`);
}

if (html.includes('src="/assets/') || html.includes('href="/assets/')) {
  throw new Error('Site build still points to root-level /assets paths instead of the GitHub Pages base path.');
}

if (!html.includes(`src="${basePath}assets/`) && !html.includes(`href="${basePath}assets/`)) {
  throw new Error(`Expected built asset paths to include the GitHub Pages base path ${basePath}.`);
}

if (fallbackHtml !== html) {
  throw new Error('Expected site/dist/404.html to match index.html for GitHub Pages SPA routing.');
}

if (galleryHtml !== html) {
  throw new Error('Expected site/dist/gallery/index.html to match index.html for direct GitHub Pages routing.');
}

if (!llmsTxt.includes(llmsFullUrl)) {
  throw new Error('Expected site/dist/llms.txt to link to the generated llms-full.txt file.');
}

if (!llmsFullTxt.includes(packageJson.name) || !llmsFullTxt.includes('## Documentation Site Content')) {
  throw new Error('Expected site/dist/llms-full.txt to include generated package and site documentation content.');
}

console.log(`Verified site build metadata, SPA fallback, LLM docs, and GitHub Pages asset paths for ${homepage}.`);
