/**
 * BrandForge Studio — unified icon set
 * ----------------------------------------------------------------------------
 * One consistent icon family: outlined, 1.5px stroke, 20×20 viewBox, inherits
 * `currentColor`. No emoji, no mixed styles (Design Bible §13). Every icon is a
 * pure SVG string so it can be injected into static markup or JS templates alike.
 *
 * This is presentation infrastructure only — it holds no state and changes no
 * behaviour. The same path data is mirrored inline in index.html for the static
 * option cards to avoid a runtime DOM-swap.
 */

const A = 'fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';

const PATHS = {
  // Card sizes
  'size-standard': `<rect x="5" y="3" width="14" height="18" rx="2.5"/>`,
  'size-compact': `<rect x="7" y="6" width="10" height="12" rx="2"/>`,
  'size-large': `<rect x="3" y="6" width="18" height="12" rx="2.5"/>`,
  'size-signature': `<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M4 7l8 6 8-6"/>`,

  // Orientation
  'orientation-vertical': `<path d="M12 20V4M7 9l5-5 5 5"/>`,
  'orientation-horizontal': `<path d="M4 12h16M15 7l5 5-5 5"/>`,

  // Alignment
  'align-left': `<path d="M4 6h16M4 12h10M4 18h13"/>`,
  'align-center': `<path d="M4 6h16M7 12h10M5 18h14"/>`,

  // Export
  'export-web': `<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 2.5 15.5 0 18M12 3c-2.5 2.5-2.5 15.5 0 18"/>`,
  'export-email': `<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M4 7l8 6 8-6"/>`,

  // Social link controls
  'eye': `<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>`,
  'eye-off': `<path d="M3 3l18 18M10.6 6.2A10.9 10.9 0 0 1 12 6c6.5 0 10 6 10 6a18 18 0 0 1-3.2 3.8M6.5 7.6A18 18 0 0 0 2 12s3.5 6 10 6a10.8 10.8 0 0 0 4-.8"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>`,
  'trash': `<path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/>`,
  'plus': `<path d="M12 5v14M5 12h14"/>`,

  // Themes
  'theme-light': `<circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>`,
  'theme-dark': `<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>`,
  'theme-glass': `<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M4 14l4-4 3 3 4-5 5 6"/>`,
  'theme-dark-glass': `<rect x="3" y="3" width="18" height="18" rx="3.5"/><circle cx="9" cy="9" r="2"/><path d="M14 15l3-3"/>`,

  // Templates reuse size glyphs for consistency
  'template-standard': `<rect x="5" y="3" width="14" height="18" rx="2.5"/>`,
  'template-compact': `<rect x="7" y="6" width="10" height="12" rx="2"/>`,
  'template-large': `<rect x="3" y="6" width="18" height="12" rx="2.5"/>`,
  'template-signature': `<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M4 7l8 6 8-6"/>`,
  'template-horizontal': `<rect x="3" y="6" width="18" height="12" rx="2.5"/>`,

  // Misc actions
  'copy': `<rect x="9" y="9" width="12" height="12" rx="2.5"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/>`,
  'share': `<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"/>`,
  'save': `<path d="M5 3h12l4 4v14H3V3Z"/><path d="M8 3v6h8V3M8 21v-7h8v7"/>`,
  'new': `<path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v4h4M12 12v6M9 15h6"/>`,
  'download': `<path d="M12 3v12M7 11l5 5 5-5M5 21h14"/>`,
  'home': `<path d="M4 11.5L12 4l8 7.5M6 10v10h12V10"/>`
};

/** Returns an inline SVG string for the named icon, or a fallback dot. */
export function icon(name) {
  const body = PATHS[name] || PATHS['size-standard'];
  return `<svg class="icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" ${A}>${body}</svg>`;
}
