/**
 * Base Renderer - Component architecture for email signature rendering
 * Arch: LAYER 3, CORE - The rendering foundation
 */

import { DesignLayer } from './designLayer.js';
import { AccentSystem } from './accentSystem.js';
import { IconSystem } from './iconSystem.js';
import { WebWovenBranding } from './branding.js';

// --- Component Implementations ---

export class AvatarRenderer {
  render(data, context) {
    const imageUrl = data.imageUrl || '';
    const artDirection = context.artDirection || 'signature';
    
    let avatarStyle = '';
    
    switch (artDirection) {
      case 'chairman':
        // Passport-style rectangular crop with architectural keyline
        avatarStyle = `
          width: 70px;
          height: 90px;
          object-fit: cover;
          border: 1px solid #333333;
          display: block;
        `;
        break;
      case 'monarch':
        // Museum-style double frame
        return `
          <div style="padding: 4px; border: 1px solid #d4af37; display: inline-block;">
            <div style="padding: 2px; border: 0.5px solid #d4af37; background: #ffffff;">
              <img src="${imageUrl || 'https://api.dicebear.com/7.x/avataaars/png?seed=John'}" 
                   alt="Profile" 
                   style="width: 75px; height: 75px; object-fit: cover; display: block;" />
            </div>
          </div>
        `;
      case 'canvas':
        // Large, offset portrait for creative studio
        avatarStyle = `
          width: 100px;
          height: 100px;
          object-fit: cover;
          border: none;
          display: block;
        `;
        break;
      case 'aurora':
        // Glass tile feeling with soft framing
        avatarStyle = `
          width: 80px;
          height: 80px;
          border-radius: 12px;
          object-fit: cover;
          border: 1px solid rgba(255,255,255,0.4);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          display: block;
        `;
        break;
      case 'gallery':
        // Editorial window portrait
        avatarStyle = `
          width: 90px;
          height: 120px;
          object-fit: cover;
          border: none;
          display: block;
        `;
        break;
      default: // signature
        // Signature: premium balanced circle
        avatarStyle = `
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          display: block;
        `;
    }

    if (imageUrl) {
      return `<img src="${imageUrl}" alt="Profile" style="${avatarStyle}" />`;
    } else {
      // Fallback with consistent styling
      const borderRadius = artDirection === 'chairman' || artDirection === 'gallery' ? '0' : 
                          artDirection === 'aurora' ? '12px' : '50%';
      return `
        <div style="${avatarStyle} background: #f5f5f5; border-radius: ${borderRadius}; display: flex; align-items: center; justify-content: center;">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cccccc" stroke-width="1">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
      `;
    }
  }
}

export class NameRenderer {
  render(data, context) {
    const artDirection = context.artDirection || 'signature';
    
    let style = '';
    
    switch (artDirection) {
      case 'chairman':
        style = 'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-weight: 700; color: #111111; font-size: 18px; letter-spacing: -0.01em; line-height: 1.2;';
        break;
      case 'monarch':
        style = 'font-family: "Playfair Display", Georgia, serif; font-weight: 500; color: #1a1a1a; font-size: 20px; letter-spacing: 0.05em; line-height: 1.2;';
        break;
      case 'canvas':
        style = 'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-weight: 800; color: #000000; font-size: 24px; letter-spacing: -0.02em; line-height: 1.1;';
        break;
      case 'aurora':
        style = 'font-family: "Inter", -apple-system, sans-serif; font-weight: 600; color: #111111; font-size: 17px; letter-spacing: -0.01em; line-height: 1.2;';
        break;
      case 'gallery':
        style = 'font-family: "Playfair Display", Georgia, serif; font-weight: 600; color: #000000; font-size: 22px; letter-spacing: -0.01em; line-height: 1.1;';
        break;
      default:
        style = 'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-weight: 600; color: #111111; font-size: 16px; line-height: 1.2;';
    }
    
    return `<div class="signature-name" style="${style}">${data.name}</div>`;
  }
}

export class TitleRenderer {
  render(data, context) {
    const artDirection = context.artDirection || 'signature';
    const accentColor = context.accentColor || '#347dc7';
    
    let style = '';
    
    switch (artDirection) {
      case 'chairman':
        style = `font-family: -apple-system, sans-serif; font-weight: 500; color: ${accentColor}; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px;`;
        break;
      case 'monarch':
        style = 'font-family: "Playfair Display", serif; font-style: italic; color: #666666; font-size: 14px; letter-spacing: 0.02em; margin-top: 2px;';
        break;
      case 'canvas':
        style = `font-family: -apple-system, sans-serif; font-weight: 400; color: #333333; font-size: 15px; margin-top: 4px; border-left: 2px solid ${accentColor}; padding-left: 8px;`;
        break;
      case 'aurora':
        style = 'font-family: "Inter", sans-serif; font-weight: 400; color: #666666; font-size: 13px; margin-top: 1px;';
        break;
      case 'gallery':
        style = 'font-family: -apple-system, sans-serif; font-weight: 300; color: #444444; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px;';
        break;
      default:
        style = `font-family: -apple-system, sans-serif; font-weight: 400; color: ${accentColor}; font-size: 14px; margin-top: 2px;`;
    }
    
    return `<div class="signature-title" style="${style}">${data.jobTitle}</div>`;
  }
}

export class CompanyRenderer {
  render(data, context) {
    return `<div class="signature-company" style="color: #666666; font-size: 12px;">${data.company}</div>`;
  }
}

export class EmailContactRenderer {
  render(data, context) {
    if (!data.email) return '';
    
    const accentColor = context.accentColor || '#347dc7';
    return `
      <div class="signature-separator"></div>
      <div class="signature-contact">
        <a href="mailto:${data.email}" style="color: ${accentColor};">${data.email}</a>
      </div>
    `;
  }
}

export class PhoneContactRenderer {
  render(data, context) {
    if (!data.phone) return '';
    
    const accentColor = context.accentColor || '#347dc7';
    return `
      <div class="signature-contact">
        <span style="color: ${accentColor};">${data.phone}</span>
      </div>
    `;
  }
}

export class SocialLinksRenderer {
  render(data, context) {
    if (!data.socialLinks || data.socialLinks.length === 0) return '';
    
    const enabledLinks = data.socialLinks.filter(link => link.enabled && link.url);
    if (enabledLinks.length === 0) return '';
    
    const socialHtml = enabledLinks.map(link => {
      const platform = link.platform.toLowerCase();
      const icon = getSocialIcon(platform);
      return `<a href="${link.url}" target="_blank" style="display: inline-block; margin-right: 12px; color: #1a73e8; text-decoration: none;">${icon}</a>`;
    }).join('');
    
    return `
      <div class="signature-separator"></div>
      <div class="signature-social">
        ${socialHtml}
      </div>
    `;
  }
}

export class DividerRenderer {
  render(data, context) {
    return `
      <div class="signature-separator"></div>
    `;
  }
}

export class ContainerRenderer {
  render(data, context) {
    return `
      <div class="signature-container" style="padding: 15px;">
        {content}
      </div>
    `;
  }
}

// Required utility for social icons
function getSocialIcon(platform) {
  const icons = {
    'linkedin': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-2.637-1.534-2.637-1.522 0-1.767 1.19-1.767 2.421v5.27h-3.554V9.75h3.554v1.729c0.528-1.584 2.837-3.441 6.372-3.441 3.762 0 5.426 2.477 5.426 5.451v5.324z" fill="currentColor"/><path d="M5.337 9.75a2.075 2.075 0 1 1 0 4.15 2.075 2.075 0 0 1 0-4.15zm3.5-1.075H1.785v7.125H8.837V8.675z" fill="currentColor"/></svg>',
    'twitter': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18.244 2.25h3.308L14.7 10.477 22 21.75h-5.184l-4.126-5.377L4.73 2.25H1.53l7.191 8.828L1.53 21.75h5.184l4.189-5.45 5.193 5.45H18.244z" fill="currentColor"/></svg>',
    'github': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.087-.746.084-.73.084-.73 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.997.108-.775.418-1.305.762-1.605-2.665-.304-5.467-1.332-5.467-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 0 1 3.003-.404c1.018.005 2.045.137 3.003.404 2.29-1.552 3.295-1.23 3.295-1.23.654 1.653.241 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.806 5.624-5.479 5.92.43.37.823 1.096.823 2.21 0 1.55-.014 2.8-.014 3.17 0 .32.216.695.825.577C20.565 22.092 24 17.592 24 12.297 24 5.373 18.627.297 12 .297z" fill="currentColor"/></svg>',
    'default': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l3.5 2.5.75-1.5-2.5-2.5z" fill="currentColor"/></svg>'
  };
  return icons[platform] || icons.default;
}

// --- Registry and Base Renderer ---

export class ComponentRegistry {
  constructor() {
    this.components = new Map();
    this._registerCoreComponents();
  }

  _registerCoreComponents() {
    // Core visual components
    this.register('avatar', new AvatarRenderer());
    this.register('name', new NameRenderer());
    this.register('title', new TitleRenderer());
    this.register('company', new CompanyRenderer());
    this.register('accent', new AccentSystem());
    this.register('icon', new IconSystem());
    this.register('branding', new WebWovenBranding());
    
    // Contact rendering components
    this.register('emailContact', new EmailContactRenderer());
    this.register('phoneContact', new PhoneContactRenderer());
    this.register('socialLinks', new SocialLinksRenderer());
    
    // Structural components
    this.register('divider', new DividerRenderer());
    this.register('container', new ContainerRenderer());
  }

  register(name, component) {
    this.components.set(name, component);
  }

  get(name) {
    return this.components.get(name);
  }

  has(name) {
    return this.components.has(name);
  }

  getAll() {
    return Array.from(this.components.values());
  }
}

// Concrete renderers for email formats
export class GmailSignatureRenderer {
  constructor(registry) {
    this.registry = registry;
  }

  render(data, context) {
    const artDirection = context.artDirection || 'signature';
    
    switch (artDirection) {
      case 'gallery': return this._renderGallery(data, context);
      case 'chairman': return this._renderChairman(data, context);
      case 'monarch': return this._renderMonarch(data, context);
      case 'canvas': return this._renderCanvas(data, context);
      case 'aurora': return this._renderAurora(data, context);
      default: return this._renderSignature(data, context);
    }
  }

  _renderSignature(data, context) {
    return `
      <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; max-width: 500px;">
        <tr>
          <td width="80" valign="top" style="padding-right: 20px;">
            ${this.registry.get('avatar').render(data, context)}
          </td>
          <td valign="top">
            ${this.registry.get('name').render(data, context)}
            ${this.registry.get('title').render(data, context)}
            <div style="margin-bottom: 8px;">${this.registry.get('company').render(data, context)}</div>
            
            ${this.registry.get('emailContact').render(data, context)}
            ${this.registry.get('phoneContact').render(data, context)}
            
            <div style="margin-top: 12px;">
              ${this.registry.get('socialLinks').render(data, context)}
            </div>
            
            ${this.registry.get('divider').render(data, context)}
            ${this.registry.get('branding').render(data, context)}
          </td>
        </tr>
      </table>
    `;
  }

  _renderGallery(data, context) {
    return `
      <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; max-width: 500px;">
        <tr>
          <td align="left" style="padding-bottom: 25px;">
            <table border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td valign="top" style="padding-right: 30px;">
                  ${this.registry.get('avatar').render(data, context)}
                </td>
                <td valign="bottom" style="padding-bottom: 5px;">
                  <div style="border-left: 1px solid #000000; padding-left: 20px;">
                    ${this.registry.get('name').render(data, context)}
                    ${this.registry.get('title').render(data, context)}
                    <div style="margin-top: 15px;">
                      ${this.registry.get('company').render(data, context)}
                    </div>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td>
            <div style="margin-top: 20px; font-family: sans-serif; font-size: 12px; color: #666666;">
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right: 20px;">${this.registry.get('emailContact').render(data, context)}</td>
                  <td style="padding-right: 20px;">${this.registry.get('phoneContact').render(data, context)}</td>
                </tr>
              </table>
              <div style="margin-top: 15px;">
                ${this.registry.get('socialLinks').render(data, context)}
              </div>
            </div>
            <div style="margin-top: 30px; border-top: 0.5px solid #eeeeee; padding-top: 10px;">
              ${this.registry.get('branding').render(data, context)}
            </div>
          </td>
        </tr>
      </table>
    `;
  }

  _renderChairman(data, context) {
    const accentColor = context.accentColor || '#347dc7';
    return `
      <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; max-width: 550px; background-color: #ffffff;">
        <tr>
          <td width="90" valign="top" style="padding: 25px 0 25px 25px;">
            ${this.registry.get('avatar').render(data, context)}
          </td>
          <td valign="top" style="padding: 25px 25px 25px 20px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding-bottom: 4px;">
                  ${this.registry.get('name').render(data, context)}
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 12px;">
                  ${this.registry.get('title').render(data, context)}
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 20px; border-bottom: 1px solid #eeeeee;">
                  ${this.registry.get('company').render(data, context)}
                </td>
              </tr>
              <tr>
                <td style="padding-top: 15px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="font-family: sans-serif; font-size: 12px; color: #444444;">
                        <div style="margin-bottom: 4px;">${this.registry.get('emailContact').render(data, context)}</div>
                        <div>${this.registry.get('phoneContact').render(data, context)}</div>
                      </td>
                      <td align="right" valign="bottom">
                        ${this.registry.get('socialLinks').render(data, context)}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 0 25px 15px 25px;">
            ${this.registry.get('branding').render(data, context)}
          </td>
        </tr>
      </table>
    `;
  }

  _renderMonarch(data, context) {
    return `
      <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; max-width: 500px; text-align: center;">
        <tr>
          <td align="center" style="padding-bottom: 20px;">
            <div style="font-family: serif; font-size: 10px; letter-spacing: 0.3em; color: #d4af37; margin-bottom: 15px; text-transform: uppercase;">W W</div>
            ${this.registry.get('avatar').render(data, context)}
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 0 40px;">
            ${this.registry.get('name').render(data, context)}
            <div style="margin-top: 5px;">
              ${this.registry.get('title').render(data, context)}
            </div>
            <div style="margin-top: 10px; font-family: serif; font-size: 11px; letter-spacing: 0.1em; color: #888888; text-transform: uppercase;">
              ${this.registry.get('company').render(data, context)}
            </div>
            
            <div style="margin: 20px auto; width: 40px; border-top: 1px solid #d4af37;"></div>
            
            <div style="font-family: sans-serif; font-size: 12px; color: #666666; line-height: 1.6;">
              ${this.registry.get('emailContact').render(data, context)}
              <span style="margin: 0 10px; color: #d4af37;">|</span>
              ${this.registry.get('phoneContact').render(data, context)}
            </div>
            
            <div style="margin-top: 15px;">
              ${this.registry.get('socialLinks').render(data, context)}
            </div>
            
            <div style="margin-top: 25px;">
              ${this.registry.get('branding').render(data, context)}
            </div>
          </td>
        </tr>
      </table>
    `;
  }

  _renderCanvas(data, context) {
    const accentColor = context.accentColor || '#347dc7';
    return `
      <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; max-width: 550px;">
        <tr>
          <td width="120" valign="top" style="position: relative;">
            <div style="background-color: ${accentColor}; width: 100px; height: 140px; position: absolute; top: 10px; left: 0; z-index: 1;"></div>
            <div style="position: relative; z-index: 2; padding: 30px 0 0 20px;">
              ${this.registry.get('avatar').render(data, context)}
            </div>
          </td>
          <td valign="top" style="padding: 40px 20px 20px 10px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td>${this.registry.get('name').render(data, context)}</td>
              </tr>
              <tr>
                <td style="padding-top: 5px;">${this.registry.get('title').render(data, context)}</td>
              </tr>
              <tr>
                <td style="padding-top: 15px; font-family: sans-serif; font-size: 13px; color: #555555;">
                  ${this.registry.get('company').render(data, context)}
                </td>
              </tr>
              <tr>
                <td style="padding-top: 25px;">
                  <table border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-right: 25px; border-right: 1px solid #000000;">
                        ${this.registry.get('emailContact').render(data, context)}
                      </td>
                      <td style="padding-left: 25px;">
                        ${this.registry.get('phoneContact').render(data, context)}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding-top: 20px;">
                  ${this.registry.get('socialLinks').render(data, context)}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 20px 20px 0 20px;">
            <div style="border-bottom: 4px solid #000000; width: 60px; margin-bottom: 10px;"></div>
            ${this.registry.get('branding').render(data, context)}
          </td>
        </tr>
      </table>
    `;
  }

  _renderAurora(data, context) {
    const accentColor = context.accentColor || '#347dc7';
    return `
      <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; max-width: 500px; background: #ffffff; border: 1px solid #f0f0f0; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
        <tr>
          <td style="padding: 30px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td width="80" valign="top">
                  ${this.registry.get('avatar').render(data, context)}
                </td>
                <td valign="top" style="padding-left: 25px;">
                  <div style="background: ${accentColor}; height: 2px; width: 30px; margin-bottom: 12px;"></div>
                  ${this.registry.get('name').render(data, context)}
                  ${this.registry.get('title').render(data, context)}
                  <div style="margin-top: 8px; font-family: sans-serif; font-size: 12px; color: #999999; letter-spacing: 0.05em; text-transform: uppercase;">
                    ${this.registry.get('company').render(data, context)}
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="2" style="padding-top: 30px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background: #fafafa; border-radius: 12px; padding: 15px;">
                    <tr>
                      <td style="font-family: sans-serif; font-size: 13px; color: #555555;">
                        <div style="margin-bottom: 6px;">
                          <span style="color: ${accentColor}; font-weight: 600; margin-right: 8px;">E</span> ${this.registry.get('emailContact').render(data, context)}
                        </div>
                        <div>
                          <span style="color: ${accentColor}; font-weight: 600; margin-right: 8px;">P</span> ${this.registry.get('phoneContact').render(data, context)}
                        </div>
                      </td>
                      <td align="right">
                        ${this.registry.get('socialLinks').render(data, context)}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td colspan="2" style="padding-top: 20px;">
                  ${this.registry.get('branding').render(data, context)}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `;
  }
}

export class OutlookSignatureRenderer {
  constructor(registry) {
    this.registry = registry;
  }

  render(data, context) {
    const artDirection = context.artDirection || 'signature';
    
    switch (artDirection) {
      case 'gallery': return this._renderGallery(data, context);
      case 'chairman': return this._renderChairman(data, context);
      case 'monarch': return this._renderMonarch(data, context);
      case 'canvas': return this._renderCanvas(data, context);
      case 'aurora': return this._renderAurora(data, context);
      default: return this._renderSignature(data, context);
    }
  }

  _renderSignature(data, context) {
    // Outlook optimized signature (slightly wider)
    return `
      <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; max-width: 600px;">
        <tr>
          <td width="100" valign="top" style="padding-right: 25px;">
            ${this.registry.get('avatar').render(data, context)}
          </td>
          <td valign="top">
            ${this.registry.get('name').render(data, context)}
            ${this.registry.get('title').render(data, context)}
            <div style="margin-bottom: 10px;">${this.registry.get('company').render(data, context)}</div>
            
            <table border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-bottom: 5px;">${this.registry.get('emailContact').render(data, context)}</td>
              </tr>
              <tr>
                <td>${this.registry.get('phoneContact').render(data, context)}</td>
              </tr>
            </table>
            
            <div style="margin-top: 15px;">
              ${this.registry.get('socialLinks').render(data, context)}
            </div>
            
            <div style="margin-top: 20px; border-top: 1px solid #eeeeee; padding-top: 10px;">
              ${this.registry.get('branding').render(data, context)}
            </div>
          </td>
        </tr>
      </table>
    `;
  }

  _renderGallery(data, context) {
    // Shared editorial layout
    return new GmailSignatureRenderer(this.registry)._renderGallery(data, context);
  }

  _renderChairman(data, context) {
    // Shared executive layout
    return new GmailSignatureRenderer(this.registry)._renderChairman(data, context);
  }

  _renderMonarch(data, context) {
    // Shared luxury layout
    return new GmailSignatureRenderer(this.registry)._renderMonarch(data, context);
  }

  _renderCanvas(data, context) {
    // Shared creative layout
    return new GmailSignatureRenderer(this.registry)._renderCanvas(data, context);
  }

  _renderAurora(data, context) {
    // Shared tech layout
    return new GmailSignatureRenderer(this.registry)._renderAurora(data, context);
  }
}

export class UniversalSignatureRenderer {
  constructor(registry) {
    this.registry = registry;
  }

  render(data, context) {
    const artDirection = context.artDirection || 'signature';
    
    switch (artDirection) {
      case 'gallery': return this._renderGallery(data, context);
      case 'chairman': return this._renderChairman(data, context);
      case 'monarch': return this._renderMonarch(data, context);
      case 'canvas': return this._renderCanvas(data, context);
      case 'aurora': return this._renderAurora(data, context);
      default: return this._renderSignature(data, context);
    }
  }

  _renderSignature(data, context) {
    return new GmailSignatureRenderer(this.registry)._renderSignature(data, context);
  }

  _renderGallery(data, context) {
    return new GmailSignatureRenderer(this.registry)._renderGallery(data, context);
  }

  _renderChairman(data, context) {
    return new GmailSignatureRenderer(this.registry)._renderChairman(data, context);
  }

  _renderMonarch(data, context) {
    return new GmailSignatureRenderer(this.registry)._renderMonarch(data, context);
  }

  _renderCanvas(data, context) {
    return new GmailSignatureRenderer(this.registry)._renderCanvas(data, context);
  }

  _renderAurora(data, context) {
    return new GmailSignatureRenderer(this.registry)._renderAurora(data, context);
  }
}

export class EmailRendererBase {
  constructor(componentRegistry) {
    this.registry = componentRegistry || new ComponentRegistry();
    this.designLayer = new DesignLayer();
    this.renderers = new Map();
    this._initRendererRegistry();
  }

  _initRendererRegistry() {
    // Map format names to renderer implementations
    this.renderers = new Map([
      ['gmail', new GmailSignatureRenderer(this.registry)],
      ['outlook', new OutlookSignatureRenderer(this.registry)],
      ['universal', new UniversalSignatureRenderer(this.registry)],
      ['default', new GmailSignatureRenderer(this.registry)] // fallback
    ]);
  }

  getFormat(format) {
    return this.renderers.get(format) || this.renderers.get('default');
  }

  getCollection(collectionId) {
    return this.designLayer.getCollection(collectionId);
  }

  composeGlobalStyles(accentColor, format, collectionId) {
    const collection = this.getCollection(collectionId);
    const emailAccent = accentColor || 
      (collection.tokens && collection.tokens.emailAccent) || 
      '#347dc7';
    
    return `
      body, table, td, p, a { margin: 0; padding: 0; }
      body { font-family: Arial, sans-serif; font-size: 14px; color: #333333; line-height: 1.4; }
      table { border-collapse: collapse; width: 100%; }
      img { display: block; border: 0; max-width: 100%; height: auto; }
      a { color: ${emailAccent}; text-decoration: none; }
      .gmail-signature { background: transparent; }
      @media (max-width: 600px) {
        .signature-container { max-width: 100% !important; }
        .signature-img { width: 60px !important; height: 60px !important; }
      }
    `;
  }
}
