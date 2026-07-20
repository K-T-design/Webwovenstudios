import { $, $$, sanitizeHTML, sanitizeImageURL } from '../utils/dom.js';
import { appState } from '../config/state.js';
import { SOCIAL_PLATFORMS } from '../config/constants.js';
import { icon } from '../utils/icons.js';

export class MultiStepForm {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 7;
    
    this.initEventListeners();
    this.bindInputsToState();
    this.updateUI();
  }

  initEventListeners() {
    $('#btnNext')?.addEventListener('click', () => this.nextStep());
    $('#btnPrev')?.addEventListener('click', () => this.prevStep());
    
    // Bind option cards (Theme, Size, etc)
    const selectOptionCard = (card) => {
      if (!card) return;
      const type = card.dataset.type;
      const value = card.dataset.value;

      $$(`.option-card[data-type="${type}"]`).forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      appState.update({ [type]: value });
    };

    document.addEventListener('click', (e) => {
      const card = e.target.closest('.option-card');
      if (card) selectOptionCard(card);
    });

    // Keyboard activation for role="button" option cards (WCAG 2.1.1 — keyboard nav).
    // Native click does not fire from Enter/Space on non-<button> elements, so we
    // forward them explicitly. This is an accessibility fix, not a new feature.
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
      const card = e.target.closest && e.target.closest('.option-card');
      if (card) {
        e.preventDefault();
        selectOptionCard(card);
      }
    });

    // Image Upload (Method 1)
    $('#imageUpload')?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        // Validate file type and size
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB
        if (!file.type.startsWith('image/') || file.size > MAX_SIZE) {
          e.target.value = '';
          return;
        }
        const reader = new FileReader();
        reader.onload = (ev) => {
          const result = ev.target.result;
          if (typeof result === 'string' && result.startsWith('data:image/')) {
            appState.update({ imageUrl: result });
          }
          const urlInput = $('#imageUrl');
          if (urlInput) urlInput.value = ''; // clear url input if file uploaded
        };
        reader.readAsDataURL(file);
      }
    });

    // Social Link Actions
    $('#btnAddSocial')?.addEventListener('click', () => {
      appState.addSocialLink();
    });

    // Color picker
    $('#accentColor')?.addEventListener('input', (e) => {
      appState.update({ accentColor: e.target.value });
    });
  }

  bindInputsToState() {
    const inputs = ['name', 'jobTitle', 'company', 'email', 'phone', 'imageUrl'];
    
    inputs.forEach(key => {
      const el = $(`#${key}`);
      if (el) {
        el.value = appState.get()[key] || '';
        el.addEventListener('input', (e) => {
          appState.update({ [key]: e.target.value });
        });
      }
    });

    // Handle Social Link UI rendering
    appState.subscribe((state) => {
      this.renderSocialLinks(state.socialLinks);
      
      // Update other inputs if state changed elsewhere
      inputs.forEach(key => {
        const el = $(`#${key}`);
        if (el && el.value !== state[key]) {
          el.value = state[key] || '';
        }
      });
      
      const colorPicker = $('#accentColor');
      if (colorPicker && colorPicker.value !== state.accentColor) {
        colorPicker.value = state.accentColor;
      }
      
      ['theme', 'size', 'orientation', 'alignment', 'collection', 'template'].forEach(type => {
        $$(`.option-card[data-type="${type}"]`).forEach(c => {
          if (c.dataset.value === state[type]) {
            c.classList.add('selected');
          } else {
            c.classList.remove('selected');
          }
        });
      });
    });
  }

  renderSocialLinks(socialLinks) {
    const container = $('#socialLinksContainer');
    if (!container) return;

    // To prevent cursor jumping, we only re-render if count changes 
    // or we can use a more surgical update. For simplicity, we'll re-render 
    // but check for focused elements.
    const focusedId = document.activeElement?.id;
    
    container.innerHTML = '';
    
    socialLinks.forEach((link, index) => {
      const item = document.createElement('div');
      item.className = 'social-link-item';
      item.innerHTML = `
        <div class="social-link-header">
          <select class="form-control social-platform-select" style="width: 150px;" data-index="${index}">
            ${SOCIAL_PLATFORMS.map(p => `<option value="${p.id}" ${p.id === link.platform ? 'selected' : ''}>${p.name}</option>`).join('')}
          </select>
          <div class="social-link-controls">
            <button class="btn btn-icon btn-outline btn-toggle-link" data-index="${index}" title="${link.enabled ? 'Disable' : 'Enable'}" aria-label="${link.enabled ? 'Disable link' : 'Enable link'}">
              ${icon(link.enabled ? 'eye' : 'eye-off')}
            </button>
            <button class="btn btn-icon btn-outline btn-remove-link btn-danger" data-index="${index}" title="Remove" aria-label="Remove link">
              ${icon('trash')}
            </button>
          </div>
        </div>
        <input type="url" class="form-control social-url-input" 
               placeholder="https://..." 
               value="${sanitizeHTML(link.url)}" 
               data-index="${index}"
               id="social-url-${index}">
      `;
      container.appendChild(item);
    });

    // Re-focus if we were editing a URL
    if (focusedId) {
      document.getElementById(focusedId)?.focus();
    }

    // Attach listeners to new elements
    container.querySelectorAll('.social-platform-select').forEach(select => {
      select.addEventListener('change', (e) => {
        appState.updateSocialLink(parseInt(e.target.dataset.index), { platform: e.target.value });
      });
    });

    container.querySelectorAll('.social-url-input').forEach(input => {
      input.addEventListener('input', (e) => {
        appState.updateSocialLink(parseInt(e.target.dataset.index), { url: e.target.value });
      });
    });

    container.querySelectorAll('.btn-remove-link').forEach(btn => {
      btn.addEventListener('click', (e) => {
        appState.removeSocialLink(parseInt(e.currentTarget.dataset.index));
      });
    });

    container.querySelectorAll('.btn-toggle-link').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.dataset.index);
        const enabled = socialLinks[index].enabled;
        appState.updateSocialLink(index, { enabled: !enabled });
      });
    });
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.updateUI();
    } else {
      // Trigger final export logic or notification
      document.dispatchEvent(new CustomEvent('form-finished'));
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateUI();
    }
  }

  setStep(step) {
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStep = step;
      this.updateUI();
    }
  }

  updateUI() {
    // Update dots
    $$('.step-dot').forEach((dot, index) => {
      const stepNum = index + 1;
      dot.classList.remove('active', 'completed');
      if (stepNum === this.currentStep) {
        dot.classList.add('active');
      } else if (stepNum < this.currentStep) {
        dot.classList.add('completed');
      }
    });

    // Show correct form step
    $$('.form-step').forEach((step, index) => {
      if (index + 1 === this.currentStep) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });

    // Update buttons
    const btnPrev = $('#btnPrev');
    const btnNext = $('#btnNext');
    
    if (btnPrev) btnPrev.style.visibility = this.currentStep === 1 ? 'hidden' : 'visible';
    if (btnNext) btnNext.textContent = this.currentStep === this.totalSteps ? 'Finish' : 'Next Step';
  }
}
