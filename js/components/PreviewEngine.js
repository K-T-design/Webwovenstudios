import { $, $$, sanitizeHTML, sanitizeURL, sanitizeImageURL } from '../utils/dom.js';
import { appState } from '../config/state.js';
import { SOCIAL_PLATFORMS } from '../config/constants.js';

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
    this.container.dataset.theme = state.theme;
    this.container.dataset.size = state.size;
    this.container.dataset.orientation = state.orientation;
    this.container.dataset.alignment = state.alignment;
    
    // Apply accent color as inline custom property
    this.container.style.setProperty('--card-accent', state.accentColor);

    // Update Text Content (textContent is inherently safe)
    $('#cardName').textContent = state.name || 'Your Name';
    $('#cardJobTitle').textContent = state.jobTitle || 'Job Title';
    $('#cardCompany').textContent = state.company || 'Company';
    
    // Update Image (validate URL scheme)
    const avatarImg = $('#cardAvatarImg');
    if (avatarImg) {
      const safeImage = sanitizeImageURL(state.imageUrl);
      avatarImg.src = safeImage || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback';
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
