/**
 * Email Exporter Utility Functions - Core utilities for email signature generation
 * 
 * Refined for production-ready quality.
 */

export function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function safeURL(url) {
  if (typeof url !== 'string' || url.trim() === '') return '';
  const u = url.trim();
  if (/^(https?:|mailto:|tel:|data:image\/)/i.test(u)) return u.replace(/"/g, '%22');
  return '';
}

export function sanitizeSocialLinks(links) {
  return (links || []).map(link => ({
    ...link,
    url: safeURL(link.url),
    platform: String(link.platform ?? 'custom')
  }));
}

export function getSocialIcon(platform, label = '') {
  const icons = {
    'linkedin': `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-2.637-1.534-2.637-1.522 0-1.767 1.19-1.767 2.421v5.27h-3.554V9.75h3.554v1.729c0.528-1.584 2.837-3.441 6.372-3.441 3.762 0 5.426 2.477 5.426 5.451v5.324z"/><path d="M5.337 9.75a2.075 2.075 0 1 1 0 4.15 2.075 2.075 0 0 1 0-4.15zm3.5-1.075H1.785v7.125H8.837V8.675z"/></svg>`,
    'twitter': `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308L14.7 10.477 22 21.75h-5.184l-4.126-5.377L4.73 2.25H1.53l7.191 8.828L1.53 21.75h5.184l4.189-5.45 5.193 5.45H18.244z"/></svg>`,
    'github': `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.087-.746.084-.73.084-.73 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.997.108-.775.418-1.305.762-1.605-2.665-.304-5.467-1.332-5.467-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 0 1 3.003-.404c1.018.005 2.045.137 3.003.404 2.29-1.552 3.295-1.23 3.295-1.23.654 1.653.241 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.806 5.624-5.479 5.92.43.37.823 1.096.823 2.21 0 1.55-.014 2.8-.014 3.17 0 .32.216.695.825.577C20.565 22.092 24 17.592 24 12.297 24 5.373 18.627.297 12.297z"/></svg>`,
    'default': `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l3.5 2.5.75-1.5-2.5-2.5z"/></svg>`
  };
  
  return icons[platform] || icons.default;
}
