/**
 * Accent System - Centralized color management for email signatures
 * Arch: SHARED - Single source of accent colors across all components
 */

export class AccentSystem {
  constructor() {
    this.registrar = {
      // Premium signature collection tokens
      signature: {
        emailAccent: '#347dc7',
        background: '#ffffff',
        surface: '#ffffff',
        textPrimary: '#000000',
        textSecondary: '#666666',
        divider: '#dddddd'
      },
      // Artist themes for future collections
      gallery: { emailAccent: '#4f46e5' },
      chairman: { emailAccent: '#059669' },
      monarch: { emailAccent: '#dc2626' },
      canvas: { emailAccent: '#eab308' },
      aurora: { emailAccent: '#8b5cf6' }
    };
    this.themeRegistry = {
      default: 'signature',
      light: 'signature',
      dark: 'signature',
      glass: 'signature'
    };
  }

  resolve(artDirection = 'signature', theme = 'default') {
    const artKey = artDirection.toLowerCase();
    const themeKey = theme.toLowerCase();
    
    const collectionToken = this.registrar[artKey] || this.registrar.signature;
    
    return {
      ...collectionToken,
      // Theme overrides
      ...(this.themeRegistry[themeKey] && artKey !== this.themeRegistry[themeKey] 
        ? this.registrar[this.themeRegistry[themeKey]] 
        : {})
    };
  }

  applyToElement(element, colorProp, artDirection = 'signature', theme = 'default') {
    const tokens = this.resolve(artDirection, theme);
    const color = colorProp === 'accent' ? tokens.emailAccent : 
                  colorProp === 'background' ? tokens.background :
                  colorProp === 'surface' ? tokens.surface :
                  colorProp === 'textPrimary' ? tokens.textPrimary :
                  colorProp === 'textSecondary' ? tokens.textSecondary :
                  colorProp === 'divider' ? tokens.divider : tokens.emailAccent;
    
    if (element.style) {
      element.style.setProperty(colorProp, color);
    }
    return color;
  }

  getEmailAccent(artDirection = 'signature', theme = 'default') {
    return this.resolve(artDirection, theme).emailAccent;
  }
}