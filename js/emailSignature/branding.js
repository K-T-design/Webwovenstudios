/**
 * WebWoven Branding - Elegant, understated premium branding
 * Arch: SHARED - Manages all WebWoven branding for email signatures
 */

export class WebWovenBranding {
  constructor() {
    this.brandingEnabled = true;
    this.variant = 'subtle';
    this.position = 'bottom';
  }

  render(data, context) {
    if (!this.brandingEnabled) return '';
    
    const accentColor = context.accentColor || '#347dc7';
    
    const brandingHtml = `
      <div class="webwoven-branding" style="
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 16px;
        padding-top: 12px;
        border-top: 1px solid ${accentColor}20;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 11px;
        color: #999999;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        font-weight: 500;
      ">
        <span style="color: ${accentColor}; font-weight: 600;">WebWoven Studios</span>
        <span style="margin: 0 8px;">•</span>
        <span>Handcrafted Digital Experiences</span>
      </div>
    `;
    
    return brandingHtml;
  }

  enable() {
    this.brandingEnabled = true;
    return this;
  }

  disable() {
    this.brandingEnabled = false;
    return this;
  }

  setVariant(variant) {
    this.variant = variant;
    return this;
  }

  setPosition(position) {
    this.position = position;
    return this;
  }
}