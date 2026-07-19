import { $ } from './utils/dom.js';
import { appState } from './config/state.js';
import { MultiStepForm } from './components/MultiStepForm.js';
import { PreviewEngine } from './components/PreviewEngine.js';
import { generateStandaloneHTML } from './utils/export.js';
import { BackendService } from './services/backend.js';
import { generateEmailHTML } from './utils/emailExporter.js';

class App {
  constructor() {
    this.init();
  }

  init() {
    // Initialize Components
    this.previewEngine = new PreviewEngine();
    this.multiStepForm = new MultiStepForm();

    this.initHeaderActions();
    this.initExportActions();
    this.initImageUpload();
    this.initStep7Logic();
  }

  initHeaderActions() {
    $('#btnNewProfile')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to start a new profile? All unsaved changes will be lost.')) {
        appState.reset();
        this.showNotification('🆕 New profile started!');
      }
    });

    $('#btnSave')?.addEventListener('click', async () => {
      const btn = $('#btnSave');
      const originalText = btn.textContent;
      btn.textContent = 'Saving...';
      btn.disabled = true;
      appState.setLoading(true);
      
      try {
        const result = await BackendService.saveProfile(appState.get());
        if (result.success) {
          appState.update({ id: result.id });
          this.showNotification('✅ Profile saved successfully!');
        }
      } catch (e) {
        console.error(e);
        this.showNotification('❌ Error saving profile.', 'error');
      } finally {
        btn.textContent = originalText;
        btn.disabled = false;
        appState.setLoading(false);
      }
    });

    $('#btnShare')?.addEventListener('click', async () => {
      const btn = $('#btnShare');
      const originalText = btn.textContent;
      btn.textContent = 'Generating...';
      btn.disabled = true;
      
      try {
        const link = `https://profile-gen.app/view?id=${appState.get().id || 'new'}`;
        prompt('Copy your share link:', link);
      } catch (e) {
        this.showNotification('❌ Error generating share link.', 'error');
      } finally {
        btn.textContent = originalText;
        btn.disabled = false;
      }
    });

    // For legacy/quick access
    $('#btnEmailExport')?.addEventListener('click', () => {
      this.multiStepForm.setStep(7);
      // Select email option automatically
      const emailOption = document.querySelector('.option-card[data-value="email"]');
      if (emailOption) emailOption.click();
    });

    $('#btnExport')?.addEventListener('click', () => {
      this.multiStepForm.setStep(7);
      // Select standard option automatically
      const standardOption = document.querySelector('.option-card[data-value="standard"]');
      if (standardOption) standardOption.click();
    });
  }

  initExportActions() {
    $('#btnFinalExport')?.addEventListener('click', () => {
      const format = document.querySelector('.option-card[data-type="export-format"].selected')?.dataset.value;
      if (format === 'standard') {
        this.downloadStandardHTML();
      } else {
        this.downloadEmailHTML();
      }
    });

    $('#btnCopyExport')?.addEventListener('click', () => {
      const format = document.querySelector('.option-card[data-type="export-format"].selected')?.dataset.value;
      if (format === 'standard') {
        this.copyStandardHTML();
      } else {
        this.copyEmailHTML();
      }
    });
  }

  initImageUpload() {
    $('#imageUpload')?.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        // Validate file type and size for security/performance
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB
        if (!file.type.startsWith('image/')) {
          this.showNotification('❌ Please select a valid image file.', 'error');
          e.target.value = '';
          return;
        }
        if (file.size > MAX_SIZE) {
          this.showNotification('❌ Image must be smaller than 5MB.', 'error');
          e.target.value = '';
          return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
          const base64Data = event.target.result;
          // Sanitize the data URL scheme before storing
          if (typeof base64Data === 'string' && base64Data.startsWith('data:image/')) {
            appState.update({ imageUrl: base64Data });
          }
          
          try {
            const result = await BackendService.uploadImage(base64Data, file.name);
            if (result.success && result.url) {
              appState.update({ imageUrl: result.url });
            }
          } catch (error) {
            console.warn('Image upload failed, using local preview.', error);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  initStep7Logic() {
    // Listen for export format changes
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.option-card[data-type="export-format"]');
      if (card) {
        const value = card.dataset.value;
        const emailOptions = $('#emailExportOptions');
        
        if (value === 'email') {
          emailOptions.style.display = 'block';
          this.updateEmailPreview();
        } else {
          emailOptions.style.display = 'none';
          this.updateStandardPreview();
        }
      }
    });

    // Listen for email format changes
    $('#emailFormatSelect')?.addEventListener('change', () => {
      this.updateEmailPreview();
    });

    // Subscribe to state changes to update previews if in Step 7
    appState.subscribe((state) => {
      if (this.multiStepForm.currentStep === 7) {
        const format = document.querySelector('.option-card[data-type="export-format"].selected')?.dataset.value;
        if (format === 'email') {
          this.updateEmailPreview();
        }
      }
    });

    // Listen for form finish
    document.addEventListener('form-finished', () => {
      this.showNotification('🎉 Your profile card is ready for export!');
      // Optionally trigger the default export
      $('#btnFinalExport')?.click();
    });
  }

  updateEmailPreview() {
    const state = appState.get();
    const format = $('#emailFormatSelect')?.value || 'gmail';
    const emailHtml = generateEmailHTML(state, format);
    
    const previewCard = $('#previewCard');
    const emailPreviewCard = $('#emailPreviewCard');
    const emailPreviewContent = $('#emailPreviewContent');

    if (previewCard) previewCard.style.display = 'none';
    if (emailPreviewCard) emailPreviewCard.style.display = 'block';
    
    // Extract body content for preview
    const parser = new DOMParser();
    const doc = parser.parseFromString(emailHtml, 'text/html');
    const bodyContent = doc.body.innerHTML;
    
    if (emailPreviewContent) {
      emailPreviewContent.innerHTML = bodyContent;
    }
  }

  updateStandardPreview() {
    const previewCard = $('#previewCard');
    const emailPreviewCard = $('#emailPreviewCard');

    if (previewCard) previewCard.style.display = 'block';
    if (emailPreviewCard) emailPreviewCard.style.display = 'none';
  }

  downloadStandardHTML() {
    const cardEl = $('#previewCard');
    const state = appState.get();
    const html = generateStandaloneHTML(cardEl, state);
    this.downloadFile(html, `${state.name.replace(/\s+/g, '_')}_ProfileCard.html`);
    this.showNotification('✅ Standard HTML downloaded!');
  }

  downloadEmailHTML() {
    const state = appState.get();
    const format = $('#emailFormatSelect')?.value || 'gmail';
    const html = generateEmailHTML(state, format);
    this.downloadFile(html, `${state.name.replace(/\s+/g, '_')}_EmailSignature.html`);
    this.showNotification('✅ Email signature downloaded!');
  }

  copyStandardHTML() {
    const cardEl = $('#previewCard');
    const state = appState.get();
    const html = generateStandaloneHTML(cardEl, state);
    this.copyToClipboard(html);
  }

  copyEmailHTML() {
    const state = appState.get();
    const format = $('#emailFormatSelect')?.value || 'gmail';
    const html = generateEmailHTML(state, format);
    
    // For email, we try to copy as rich text/HTML if possible
    try {
      const blob = new Blob([html], { type: 'text/html' });
      const data = [new ClipboardItem({ 'text/html': blob })];
      navigator.clipboard.write(data).then(() => {
        this.showNotification('✅ Rich email signature copied!');
      }).catch(() => {
        // Fallback to plain text
        this.copyToClipboard(html);
      });
    } catch (e) {
      this.copyToClipboard(html);
    }
  }

  copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      this.showNotification('✅ Copied to clipboard!');
    }).catch(err => {
      console.error('Copy failed:', err);
      this.showNotification('❌ Copy failed.', 'error');
    });
  }

  downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  showNotification(message, type = 'success') {
    const existing = document.querySelector('.app-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `app-notification ${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? 'var(--brand-primary)' : '#d93025'};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      font-weight: 600;
      animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(-20px)';
      notification.style.transition = 'all 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
