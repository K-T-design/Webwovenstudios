const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');

// Capture console errors
const originalError = console.error;
const errors = [];
console.error = (...args) => {
  errors.push(args.join(' '));
  originalError(...args);
};

const dom = new JSDOM(html, { 
  runScripts: 'dangerously', 
  resources: 'usable',
  url: "file://" + path.resolve(__dirname, 'index.html') 
});
const { window } = dom;

// Mock browser APIs
window.URL.createObjectURL = () => 'blob:mock-url';
window.URL.revokeObjectURL = () => {};
window.confirm = () => true; 
window.alert = () => {}; 
window.prompt = () => ''; 
window.getComputedStyle = () => ({ getPropertyValue: () => '' });
window.matchMedia = () => ({ matches: false, addListener: () => {}, removeListener: () => {} });
window.scrollTo = () => {};
window.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {} };
window.sessionStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {} };
window.navigator.clipboard = { writeText: async () => {} };
window.navigator.share = async () => {};

// Wait for scripts to load
window.addEventListener('load', () => {
  if (errors.length > 0) {
    console.log('\n--- JavaScript Errors ---');
    errors.forEach(err => console.log(err));
    process.exit(1);
  } else {
    console.log('\n--- No JavaScript errors detected on page load. ---');
    process.exit(0);
  }
});

// Fallback timeout in case scripts fail to load
setTimeout(() => {
  if (errors.length > 0) {
    console.log('\n--- JavaScript Errors ---');
    errors.forEach(err => console.log(err));
    process.exit(1);
  } else {
    console.log('\n--- No JavaScript errors detected on page load. ---');
    process.exit(0);
  }
}, 3000);
