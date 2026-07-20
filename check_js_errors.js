// ESM-aware Studio validation harness (replaces the old jsdom-only checker).
//
// WHY THIS EXISTS: the previous check_js_errors.js relied on jsdom executing
// <script type="module">, which jsdom does NOT support. It therefore reported
// "No JavaScript errors" even when main.js failed to evaluate (e.g. a bad named
// import aborting the entire module graph). That blind spot hid real regressions.
//
// This harness imports main.js as a NATIVE ES module under a jsdom global
// environment, dispatches DOMContentLoaded so the App constructs, and captures
// any thrown error during import/construction — the same path the browser runs.
//
// Run: node check_js_errors.js
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const html = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf8');
const errors = [];

const dom = new JSDOM(html, {
  url: 'file://' + path.resolve(process.cwd(), 'index.html'),
  pretendToBeVisual: true
});
const { window } = dom;

// Wire globals BEFORE importing modules that read them at evaluation time.
global.window = window;
global.document = window.document;
global.location = window.location;
global.HTMLElement = window.HTMLElement;
global.CustomEvent = window.CustomEvent;
global.DOMParser = window.DOMParser;
global.Blob = window.Blob;
global.FileReader = window.FileReader;
global.getComputedStyle = window.getComputedStyle.bind(window);
window.URL.createObjectURL = () => 'blob:mock-url';
window.URL.revokeObjectURL = () => {};
window.confirm = () => true;
window.alert = () => {};
window.prompt = () => '';
window.scrollTo = () => {};
window.matchMedia = window.matchMedia || (() => ({ matches: false, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {} }));
window.navigator.clipboard = { writeText: async () => {}, write: async () => {} };

// Capture real errors (window.error + uncaught + unhandled rejections).
window.addEventListener('error', (e) => {
  errors.push('window.error: ' + (e.error?.stack || e.message));
});
process.on('uncaughtException', (e) => errors.push('uncaught: ' + (e.stack || e)));
process.on('unhandledRejection', (e) => errors.push('unhandledRejection: ' + (e?.stack || e)));

// Mock fetch so lazy collection/animation CSS loads don't throw during init.
const cssDir = path.resolve(process.cwd(), 'css');
global.fetch = window.fetch = async (url) => {
  const u = String(url);
  const m = u.match(/css\/(.+)$/);
  if (m && fs.existsSync(path.join(cssDir, m[1]))) {
    return { ok: true, text: async () => fs.readFileSync(path.join(cssDir, m[1]), 'utf8') };
  }
  return { ok: false, text: async () => '' };
};

const mainPath = pathToFileURL(path.resolve(process.cwd(), 'js/main.js')).href;

try {
  await import(mainPath);
  window.document.dispatchEvent(new window.Event('DOMContentLoaded', { bubbles: true }));
  // Allow async lazy CSS preload to settle.
  await new Promise((r) => setTimeout(r, 400));

  const card = window.document.querySelector('#previewCard');
  const app = window.app;
  const nameText = window.document.querySelector('#cardName')?.textContent;
  const tiles = window.document.querySelectorAll('.studio-tile').length;
  const optionCards = window.document.querySelectorAll('.option-card').length;

  console.log('\n--- Studio Validation (ESM-aware) ---');
  console.log('app constructed:', !!app);
  console.log('preview card present:', !!card);
  console.log('preview rendered (name set):', !!nameText);
  console.log('collection tiles rendered:', tiles);
  console.log('theme/template option cards present:', optionCards);
  console.log('ERRORS:', errors.length);
  errors.forEach((e) => console.log('  ' + e));

  if (errors.length || !app || !card || !nameText) {
    process.exit(1);
  }
  console.log('--- No JavaScript errors detected. Studio initialized successfully. ---');
  process.exit(0);
} catch (e) {
  console.log('\n--- JavaScript Error during module import/construction ---');
  console.log(e.stack || e);
  process.exit(1);
}
