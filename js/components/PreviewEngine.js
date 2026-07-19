import { $, $$ } from '../utils/dom.js';
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

    // Update Text Content
    $('#cardName').textContent = state.name || 'Your Name';
    $('#cardJobTitle').textContent = state.jobTitle || 'Job Title';
    $('#cardCompany').textContent = state.company || 'Company';
    
    // Update Image
    const avatarImg = $('#cardAvatarImg');
    if (avatarImg) {
      avatarImg.src = state.imageUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback';
    }

    // Update Contact Info
    const contactContainer = $('#cardContact');
    contactContainer.innerHTML = '';
    
    if (state.email) {
      contactContainer.innerHTML += `
        <a href="mailto:${state.email}" class="contact-item">
          <i>✉</i> <span>${state.email}</span>
        </a>`;
    }
    if (state.phone) {
      contactContainer.innerHTML += `
        <a href="tel:${state.phone}" class="contact-item">
          <i>☏</i> <span>${state.phone}</span>
        </a>`;
    }

    // Update Dynamic Social Links
    const socialContainer = $('#cardSocial');
    socialContainer.innerHTML = '';
    
    state.socialLinks.forEach(link => {
      if (link.enabled && link.url) {
        const platform = SOCIAL_PLATFORMS.find(p => p.id === link.platform) || SOCIAL_PLATFORMS.find(p => p.id === 'custom');
        socialContainer.innerHTML += `
          <a href="${link.url}" target="_blank" class="social-item" title="${platform.name}">
            ${platform.icon}
          </a>`;
      }
    });
  }
}
