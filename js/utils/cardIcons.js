/**
 * WebWoven Studios — CANONICAL CARD ICON SYSTEM
 * ============================================================================
 * One cohesive outlined icon family, rendered identically across:
 *   - Live Preview   (inline <svg>, currentColor)            -> PreviewEngine.js
 *   - HTML Export    (clones the live DOM, inherits <svg>)   -> export.js
 *   - Gmail/Outlook  (rasterized <img> PNG via Path2D+canvas) -> emailExporter.js
 *
 * All three paths derive from the SAME path data (OUTLINE) so the visual
 * language is identical wherever the platform allows. Email clients strip
 * <svg>/web fonts, so for them the same outline is rasterized to a 24x24 PNG
 * (per ARCHITECTURE §9 — static output only, no animation).
 *
 * Design rules (Design Bible §13): outlined, 1.75 stroke, 24x24 viewBox,
 * round caps/joins, monochrome, optically centered, consistent padding.
 *
 * This module is PURE presentation data — it holds no state and changes no
 * business logic or export architecture.
 */

export const CARD_ICON_COLOR = '#1a73e8'; // email PNG fill (neutral, reads on white)

/* Canonical 24x24 outlined path data. Single source of truth. */
const OUTLINE = {
  email: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M4 7.5l8 6 8-6"/>',
  phone: '<path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 6a2 2 0 0 1 2-2Z"/>',
  website: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 2.6 15.4 0 18M12 3c-2.6 2.6-2.6 15.4 0 18"/>',
  linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7 9.5V17M7 7v.01M11 17v-4.2a2 2 0 0 1 4 0V17M11 17v-7"/>',
  x: '<path d="M4 4l16 16M20 4L4 20"/>',
  facebook: '<path d="M14 8h2V5h-2a3 3 0 0 0-3 3v2H9v3h2v6h3v-6h2l1-3h-3V8a1 1 0 0 1 1-1Z"/>',
  instagram: '<rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r="1"/>',
  tiktok: '<path d="M14 4v9.5a3.5 3.5 0 1 1-3-3.46M14 4c.5 2.6 2 4.1 4.5 4.2"/>',
  youtube: '<rect x="3" y="6" width="18" height="12" rx="3.5"/><path d="M11 9.5l4 2.5-4 2.5Z" data-fill="1"/>',
  github: '<path d="M12 3a9 9 0 0 0-2.8 17.6c.4.1.6-.2.6-.4v-1.4c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.2 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8a7.5 7.5 0 0 1 4 0c1.5-1 2.2-.8 2.2-.8.5 1.1.2 1.9.1 2.1.5.5.8 1.2.8 2.1 0 3.1-1.8 3.8-3.6 4 .3.3.6.8.6 1.6v2.4c0 .2.2.5.6.4A9 9 0 0 0 12 3Z"/>',
  gitlab: '<path d="M12 21l-3.6-11h7.2L12 21Z"/><path d="M12 21l-2.2-6M12 21l2.2-6M4.4 10h7.6M19.6 10h-7.6"/>',
  behance: '<path d="M3 7.5h4.2a2 2 0 0 1 0 4H3zM3 11.5h4.6a2 2 0 0 1 0 4H3zM14 8.2h5v1.4h-5zM14 12h5v1.4h-5z"/>',
  dribbble: '<circle cx="12" cy="12" r="9"/><path d="M5 7.5c4 3.6 9 4.6 14 3.8M3.6 13c5-.8 9 1 11.4 4.8M9 3.8c4 3.6 6 9 6 15"/>',
  medium: '<path d="M5 5h3v14H5zM10.5 5h2.8l3 8 3-8h2.8v14h-2.8l-3-8-3 8H10.5z"/>',
  devto: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14.5 5l-5 14"/>',
  discord: '<path d="M7 8.5a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v4.5a3 3 0 0 1-3 3h-1l-1-2h-2l-1 2H7a3 3 0 0 1-3-3Z"/><circle cx="9.5" cy="12" r="1"/><circle cx="14.5" cy="12" r="1"/>',
  telegram: '<path d="M21 5L3.5 11.5l5.2 1.8 1.9 5.7 3-4 4.5 3.5z"/>',
  whatsapp: '<path d="M12 4a8 8 0 0 0-6.8 12.1L4 20l4.2-1.1A8 8 0 1 0 12 4Z"/><path d="M9 9.2c0 3 2.2 5 5.2 5l-1.1-1.1-1.4 1-.5-2-2 .5z"/>',
  snapchat: '<path d="M12 4a4 4 0 0 1 4 4c0 2.8 1 3.8 1 5.8a2 2 0 0 1-3 1 3 3 0 0 1-2 .5 3 3 0 0 1-2-.5 2 2 0 0 1-3-1c0-2 1-3 1-5.8a4 4 0 0 1 4-4Z"/>',
  pinterest: '<circle cx="12" cy="12" r="9"/><path d="M12 7a5 5 0 0 0-2 9.5M10 8l1.6 9"/>',
  reddit: '<circle cx="8" cy="14" r="1.3"/><circle cx="16" cy="14" r="1.3"/><path d="M4 14a8 8 0 0 1 16 0M7 20a12 12 0 0 1 10 0M9 11a1 1 0 1 1 0-2 1 1 0 0 1 0 2M15 11a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>',
  threads: '<path d="M12 4c-4 0-6 3-6 6s2 5 5 5c2 0 3-1 3-3s-2-3-4-2M12 20c4 0 6-3 6-6"/>',
  twitch: '<path d="M5 4h13l-2 4H7v7H5zM16 7l2 4v7h-2"/>',
  stackoverflow: '<path d="M6 14l8 2M6.5 17l8 1.5M8 11l7 4M10 8l6 6M12 5l5 8"/>',
  link: '<path d="M9 12h6M10 9l-3 3 3 3M14 9l3 3-3 3"/>'
};

/* Map the (lowercased) platform keys used by emailExporter.getSocialIcon to the
   canonical icon names. Keeps email + preview in sync from one definition. */
const EMAIL_KEY_MAP = {
  linkedin: 'linkedin', x: 'x', twitter: 'x', facebook: 'facebook', instagram: 'instagram',
  tiktok: 'tiktok', youtube: 'youtube', github: 'github', gitlab: 'gitlab', behance: 'behance',
  dribbble: 'dribbble', medium: 'medium', 'dev.to': 'devto', devto: 'devto', discord: 'discord',
  telegram: 'telegram', whatsapp: 'whatsapp', snapchat: 'snapchat', pinterest: 'pinterest',
  reddit: 'reddit', threads: 'threads', twitch: 'twitch', stackoverflow: 'stackoverflow',
  website: 'website', custom: 'link'
};

/* ---- Inline SVG (Live Preview + HTML Export) ---- */
const SVG_OPEN = '<svg class="card-ico" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">';
const SVG_CLOSE = '</svg>';

export function cardIcon(name) {
  const body = OUTLINE[name] || OUTLINE.link;
  return SVG_OPEN + body.replace(/ data-fill="1"/g, ' fill="currentColor" stroke="none"') + SVG_CLOSE;
}

/* ---- Rasterized PNG for email clients (Gmail/Outlook strip SVG & fonts) ---- */
const _pngCache = {};

function pngFor(name) {
  if (name in _pngCache) return _pngCache[name];
  try {
    if (typeof document === 'undefined' || !document.createElement) { _pngCache[name] = null; return null; }
    const c = document.createElement('canvas');
    c.width = 24; c.height = 24;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, 24, 24);
    ctx.strokeStyle = CARD_ICON_COLOR;
    ctx.fillStyle = CARD_ICON_COLOR;
    ctx.lineWidth = 1.75;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    // Split fill subpaths (youtube play triangle) from stroked outline.
    const fillPaths = (OUTLINE[name] || OUTLINE.link).split('<path').slice(1)
      .filter((p) => p.includes('data-fill="1"'));
    const strokeBody = (OUTLINE[name] || OUTLINE.link).replace(/<path[^>]*data-fill="1"[^>]*\/?>/g, '');
    ctx.stroke(new Path2D(strokeBody));
    fillPaths.forEach((p) => {
      const d = p.slice(p.indexOf('d="') + 3, p.indexOf('"', p.indexOf('d="') + 3));
      ctx.fill(new Path2D(`<path d="${d}"/>`));
    });
    _pngCache[name] = c.toDataURL('image/png');
  } catch (e) {
    _pngCache[name] = null; // canvas unavailable -> callers fall back to text
  }
  return _pngCache[name];
}

/**
 * Returns an email-safe <img> (PNG) for the given platform key, or a plain
 * text label fallback if rasterization is unavailable.
 * @param {string} key  platform id (also accepts lowercased email keys)
 * @param {string} label human-readable name (used for alt + fallback text)
 */
export function emailIconImg(key, label) {
  const name = EMAIL_KEY_MAP[String(key || '').toLowerCase()] || 'link';
  const png = pngFor(name);
  const safeLabel = String(label || name).replace(/[<>&"]/g, '');
  if (png) {
    return `<img src="${png}" width="16" height="16" alt="${safeLabel}" style="vertical-align:middle;border:0;display:inline-block;" />`;
  }
  return `<span style="font-weight:600;">${safeLabel}</span>`;
}
