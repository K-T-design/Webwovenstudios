import { $, $$, sanitizeHTML, sanitizeURL, sanitizeImageURL } from '../utils/dom.js';
import { appState } from '../config/state.js';
import { SOCIAL_PLATFORMS, getCollectionTokens } from '../config/constants.js';

export class PreviewEngine {
  constructor() {
    this.container = $('#previewCard');
    this.init();
  }

  init() {
    appState.subscribe((state) => this.render(state));
  }

  render(state) {
    if (!this.container) return;

    // Apply wrapper attributes
    // ---------------------------------------------------------------------------
    // MODULAR RENDERING PIPELINE (ARCHITECTURE §6, §18, §19, §20, §21)
    // Order: Collection -> Template -> Theme -> Animation
    //   Collection  : data-collection   (art direction tokens)  [see css/collections/*]
    //   Template    : data-template     (layout/structure)       [see css/templates/*]
    //   Theme       : data-theme        (surface treatment)      [see css/themes/*]
    //   Animation   : data-animation-pack (motion pack)          [AnimationEngine.js]
    // Each layer is independent and additive; CSS attribute selectors resolve them.
    // Output is identical to the original design for the default signature collection.
    // ---------------------------------------------------------------------------
    this.container.dataset.collection = state.collection || 'signature';
    this.container.dataset.template = state.template || 'standard';
    this.container.dataset.theme = state.theme || 'light';
    this.container.dataset.size = state.size || 'standard';
    this.container.dataset.orientation = state.orientation || 'vertical';
    this.container.dataset.alignment = state.alignment || 'left';
    // NOTE: data-animation-pack is owned by AnimationEngine.js (separate module, gated
    // by animationsEnabled + prefers-reduced-motion). The Preview Engine must not set it.

    // Apply accent color as inline custom property (user customization wins over all)
    this.container.style.setProperty('--card-accent', state.accentColor || '#c92a2a');

    // Expose the portrait URL as a custom property so Collections that treat the
    // portrait as a background layer (e.g. Hero) can reference it without duplicating
    // the sanitized image source. Sanitized at render boundary (ARCHITECTURE §6).
    const portraitSrc = sanitizeImageURL(state.imageUrl) || '';
    this.container.style.setProperty('--card-photo', portraitSrc ? `url("${portraitSrc}")` : 'none');

    // Apply collection-level design tokens as inline custom properties.
    // User accent (state.accentColor) intentionally overrides --card-accent afterwards,
    // so the user's customization always wins over the collection default (ARCHITECTURE §6).
    const collectionTokens = getCollectionTokens(state.collection || 'signature');
    Object.entries(collectionTokens).forEach(([prop, value]) => {
      if (prop === '--card-accent') return; // owned by user accentColor above
      this.container.style.setProperty(prop, value);
    });

    // Update Text Content (textContent is inherently safe)
    $('#cardName').textContent = state.name || 'Your Name';
    $('#cardJobTitle').textContent = state.jobTitle || 'Job Title';
    $('#cardCompany').textContent = state.company || 'Company';

    // Accessibility: give the live card a descriptive label and hide decorative
    // layers from assistive tech (Design Bible §19). The card-header band carries
    // no text, so it is purely decorative.
    this.container.setAttribute('aria-label', `${state.name || 'Your Name'}'s identity card`);
    const header = this.container.querySelector('.card-header');
    if (header) header.setAttribute('aria-hidden', 'true');
    const avatarImg = $('#cardAvatarImg');
    if (avatarImg) {
      avatarImg.setAttribute('role', 'img');
      avatarImg.setAttribute('aria-label', `${state.name || 'Your Name'}'s portrait`);
    }

    // Update Image (validate URL scheme)
    const avatarImgEl = $('#cardAvatarImg');
    if (avatarImgEl) {
      const safeImage = sanitizeImageURL(state.imageUrl);
      avatarImgEl.src = safeImage || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback';
    }

    // Update Contact Info
    const contactContainer = $('#cardContact');
    contactContainer.innerHTML = '';
    
    if (state.email) {
      const safeEmail = sanitizeURL(`mailto:${state.email}`);
      contactContainer.innerHTML += `
        <a href="${safeEmail}" class="contact-item">
          <i>✉</i> <span>${sanitizeHTML(state.email)}</span>
        </a>`;
    }
    if (state.phone) {
      const safePhone = sanitizeURL(`tel:${state.phone}`);
      contactContainer.innerHTML += `
        <a href="${safePhone}" class="contact-item">
          <i>☏</i> <span>${sanitizeHTML(state.phone)}</span>
        </a>`;
    }

    // Update Dynamic Social Links
    const socialContainer = $('#cardSocial');
    socialContainer.innerHTML = '';
    
    state.socialLinks.forEach(link => {
      if (link.enabled && link.url) {
        const safeUrl = sanitizeURL(link.url);
        if (!safeUrl) return; // skip unsafe URLs
        const platform = SOCIAL_PLATFORMS.find(p => p.id === link.platform) || SOCIAL_PLATFORMS.find(p => p.id === 'custom');
        socialContainer.innerHTML += `
          <a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="social-item" title="${sanitizeHTML(platform.name)}">
            ${platform.icon}
          </a>`;
      }
    });
  }
}
