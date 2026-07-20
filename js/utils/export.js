/**
 * BASE_CARD_CSS — the canonical card stylesheet used for the default (signature) collection.
 *
 * This is the exact card CSS that was previously hardcoded inside generateStandaloneHTML.
 * It is extracted into a named constant so the Export Engine can COMPOSE styles instead of
 * duplicating them (ARCHITECTURE §8). Future Collections provide their own CSS string via the
 * registry (collection.css); it is appended after BASE_CARD_CSS so the base always applies as a
 * fallback and Collections layer on top.
 *
 * IMPORTANT: Do not alter this block's rules without a documented decision — it defines the
 * current application's exported appearance.
 */
export let BASE_CARD_CSS = `
    /* Base reset */
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: #f8f9fa;
      padding: 20px;
    }
    
    /* Core Card Styles — mirrors css/cards/base.css + the signature collection + themes/*
       so the standalone export is WYSIWYG with the live Preview (ARCHITECTURE §7).
       Light-theme literal values below; dark/glass overrides appended. */
    .profile-card {
      background: #ffffff;
      color: #1a1a1a;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      border: 1px solid rgba(0, 0, 0, 0.06);
      isolation: isolate;
      --card-accent: var(--card-accent, #c92a2a);
      --card-accent-2: #e85d04;
      transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1);
    }
    
    .profile-card:hover { transform: translateY(-4px); box-shadow: 0 24px 48px rgba(0, 0, 0, 0.14); }
    
    /* Decorative hairline accent (Design Bible §21) */
    .profile-card::after {
      content: ""; position: absolute; left: 0; right: 0; top: 140px; height: 1px;
      background: linear-gradient(90deg, transparent, var(--card-accent), transparent);
      opacity: 0.35; pointer-events: none; z-index: 2;
    }
    
    .profile-card[data-size="standard"] { max-width: 400px; min-height: 500px; }
    .profile-card[data-size="compact"] { max-width: 320px; min-height: 450px; }
    .profile-card[data-size="large"] { max-width: 600px; min-height: 600px; }
    .profile-card[data-size="signature"] { 
      max-width: 600px; min-height: auto; flex-direction: row; align-items: center; 
      border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #dee2e6; 
    }
    
    .profile-card[data-orientation="vertical"] { flex-direction: column; }
    .profile-card[data-orientation="horizontal"] { flex-direction: row; }
    
    .profile-card[data-theme="dark"] {
      background: #121212; color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .profile-card[data-theme="glass"] {
      background: rgba(255,255,255,0.7); color: #1a1a1a; border: 1px solid rgba(255,255,255,0.3);
      backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%);
    }
    .profile-card[data-theme="dark-glass"] {
      background: rgba(18,18,18,0.7); color: #ffffff; border: 1px solid rgba(255,255,255,0.1);
      backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%);
    }
    
    .card-header {
      background: linear-gradient(135deg, var(--card-accent), #e85d04);
      height: 140px; position: relative; transition: all 0.25s ease;
    }
    
    .profile-card[data-orientation="horizontal"] .card-header { height: auto; width: 160px; flex-shrink: 0; }
    .profile-card[data-size="signature"] .card-header { display: none; }
    
    .card-avatar {
      width: 120px; height: 120px; border-radius: 20px; border: 5px solid #ffffff;
      background: #f1f3f5; position: absolute; bottom: -60px; left: 32px; overflow: hidden;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18), 0 2px 6px rgba(0, 0, 0, 0.08); z-index: 3;
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }
    .profile-card[data-theme="dark"] .card-avatar { border-color: #121212; background: #1e1e1e; }
    .profile-card[data-theme="glass"] .card-avatar { border-color: rgba(255,255,255,0.7); }
    .profile-card[data-theme="dark-glass"] .card-avatar { border-color: rgba(18,18,18,0.7); }
    .profile-card[data-orientation="horizontal"] .card-avatar { position: static; margin: 32px; width: 100px; height: 100px; }
    .profile-card[data-alignment="center"] .card-avatar { left: 50%; transform: translateX(-50%); }
    .card-avatar img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s cubic-bezier(0.16,1,0.3,1); }
    .profile-card:hover .card-avatar { transform: translateY(-2px); }
    .profile-card:hover .card-avatar img { transform: scale(1.04); }
    
    .card-body { padding: 80px 32px 32px; flex: 1; display: flex; flex-direction: column; gap: 4px; }
    .profile-card[data-orientation="horizontal"] .card-body { padding: 32px; }
    .profile-card[data-alignment="center"] .card-body { text-align: center; }
    .profile-card[data-size="signature"] .card-body { padding: 24px; }
    
    .card-name { font-size: 1.75rem; font-weight: 800; margin-bottom: 6px; line-height: 1.1; letter-spacing: -0.02em; color: #1a1a1a; }
    .card-title { font-size: 1.05rem; color: var(--card-accent); font-weight: 700; margin-bottom: 4px; letter-spacing: 0.01em; }
    .card-company { font-size: 0.92rem; color: #666; margin-bottom: 24px; font-weight: 500; }
    .profile-card[data-theme="dark"] .card-company { color: #a0a0a0; }
    .profile-card[data-theme="glass"] .card-company { color: #444; }
    .profile-card[data-theme="dark-glass"] .card-company { color: #ccc; }
    
    .card-contact { display: flex; flex-direction: column; gap: 12px; margin-top: auto; padding-top: 24px; border-top: 1px solid rgba(0,0,0,0.06); }
    .profile-card[data-theme="dark"] .card-contact { border-top-color: rgba(255,255,255,0.05); }
    .profile-card[data-alignment="center"] .card-contact { align-items: center; }
    .contact-item { display: flex; align-items: center; gap: 12px; font-size: 0.92rem; color: #666; text-decoration: none; transition: color 0.15s ease, transform 0.15s ease; }
    .profile-card[data-theme="dark"] .contact-item { color: #a0a0a0; }
    .contact-item:hover { color: var(--card-accent); transform: translateX(2px); }
    .contact-item i { color: var(--card-accent); width: 20px; font-size: 1.05rem; text-align: center; font-style: normal; opacity: 0.9; }
    
    .card-social { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 24px; }
    .profile-card[data-alignment="center"] .card-social { justify-content: center; }
    .social-item { width: 40px; height: 40px; border-radius: 12px; background: #f8f9fa; color: #1a1a1a; display: flex; align-items: center; justify-content: center; text-decoration: none; border: 1px solid rgba(0,0,0,0.04); font-size: 1.15rem; transition: background 0.15s ease, color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease; }
    .profile-card[data-theme="dark"] .social-item { background: rgba(255,255,255,0.05); color: #fff; }
    .profile-card[data-theme="glass"] .social-item { background: rgba(255,255,255,0.4); color: #1a1a1a; }
    .profile-card[data-theme="dark-glass"] .social-item { background: rgba(255,255,255,0.05); color: #fff; }
    .social-item:hover { background: var(--card-accent); color: #fff; transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12); }
`;

import { getCollection } from '../config/constants.js';

/**
 * COLLECTION_STYLES — in-memory registry of inlined collection CSS strings.
 *
 * The Export Engine and the live Preview MUST render identically (ARCHITECTURE §7). The
 * Preview loads collection CSS via css/collections/<id>.css (imported by preview.css). The
 * Export Engine cannot rely on relative @import in all contexts (iframe/email), so it inlines
 * the same CSS here as a string.
 *
 * For the default 'signature' collection this map is intentionally EMPTY: the canonical
 * BASE_CARD_CSS below already reproduces the signature look exactly, so output is unchanged.
 * Future collections populate this map (e.g. after fetching css/collections/<id>.css once at
 * app init) and the export composes them with no engine change — satisfying "no differences
 * between Preview and HTML Export".
 */
export const COLLECTION_STYLES = {};

/**
 * setBaseCardCss — lets the build/runtime replace the canonical Signature export
 * stylesheet. The default value below is hand-maintained and regression-safe; the
 * app (main.js) may compose an equivalent string from the modular partials
 * (css/cards/base.css + css/collections/signature.css + css/themes/*.css) at init
 * and call this. If partial loading fails, the default string remains — output is
 * always reproducible exactly (ARCHITECTURE §8).
 */
export const setBaseCardCss = (text) => {
  if (typeof text === 'string' && text.trim()) baseCardCss = text;
};

export const generateStandaloneHTML = (cardElement, state) => {
  // Clone the card to avoid modifying the actual DOM
  const clone = cardElement.cloneNode(true);

  // Escape user-controlled values used in document head/attributes
  const escapeHTML = (str) => String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  
  // Extract applied inline styles and data attributes for the standalone version
  const accentColor = state.accentColor;
  
  // Shared rendering pipeline (ARCHITECTURE §7): compose the collection's inlined CSS
  // (from COLLECTION_STYLES) with baseCardCss (the Signature/export base, which may have
  // been recomposed from modular partials via setBaseCardCss, falling back to the
  // hand-maintained BASE_CARD_CSS). For 'signature', COLLECTION_STYLES['signature']
  // is undefined => only baseCardCss is used => output identical to the live Preview.
  const baseCardCss = BASE_CARD_CSS;
  const collectionCss = COLLECTION_STYLES[state.collection || 'signature'] || '';
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHTML(state.name)} — Profile Card · WebWoven Studios</title>
  <style>${collectionCss}${BASE_CARD_CSS}
    .profile-card { --card-accent: ${accentColor}; }
  </style>
</head>
<body>
  ${clone.outerHTML}
</body>
</html>`;

  return html;
};

