/**
 * Phase 2: Email Signature Design Language System - Single Source of Truth
 * This module provides the unified rendering pipeline for all email signature operations.
 * All email signature generation now flows through this system.
 */

import { DataLayer } from './emailSignature/dataLayer.js';
import { DesignLayer } from './emailSignature/designLayer.js';
import { RenderRegistry } from './emailSignature/renderRegistry.js';
import { 
  EmailRendererBase, 
  ComponentRegistry,
  GmailSignatureRenderer,
  OutlookSignatureRenderer,
  UniversalSignatureRenderer
} from './emailSignature/rendererBase.js';
import { AccentSystem } from './emailSignature/accentSystem.js';
import { IconSystem } from './emailSignature/iconSystem.js';
import { WebWovenBranding } from './emailSignature/branding.js';
import { escapeHTML, safeURL, getSocialIcon } from './emailSignature/utils/emailExporterUtils.js';

export class EmailSignatureDesignLanguageSystem {
  constructor() {
    this.dataLayer = new DataLayer();
    this.designLayer = new DesignLayer();
    this.renderRegistry = new RenderRegistry();
    this.accentSystem = new AccentSystem();
    this.iconSystem = new IconSystem();
    this.branding = new WebWovenBranding();
    this.componentRegistry = new ComponentRegistry();
    this.rendererBase = new EmailRendererBase(this.componentRegistry);
    this._initRenderers();
  }

  _initRenderers() {
    // Initialize renderers for each format
    this.gmailRenderer = new GmailSignatureRenderer(this.componentRegistry);
    this.outlookRenderer = new OutlookSignatureRenderer(this.componentRegistry);
    this.universalRenderer = new UniversalSignatureRenderer(this.componentRegistry);
  }

  // Core rendering method that all email signature functions use
  generateEmailHTML(profileData, format = 'gmail') {
    // Phase 1: Data Layer - Normalize and sanitize all user data
    const normalizedData = this.dataLayer.normalize(profileData);

    // Phase 2: Design Layer - Resolve design specifications
    const collectionId = normalizedData.collection || 'signature';
    const collection = this.designLayer.getCollection(collectionId);
    
    // Phase 3: Art Direction - Resolve the renderer for the requested design
    const artDirection = this.renderRegistry.getArtDirection(collectionId);
    const resolvedAccent = normalizedData.accentColor || 
      this.accentSystem.getEmailAccent(collection.id, normalizedData.theme);

    // Phase 4: Component setup - Prepare context for rendering
    const context = {
      accentColor: resolvedAccent,
      collectionId: collection.id,
      theme: normalizedData.theme,
      iconSystem: this.iconSystem,
      branding: this.branding,
      componentRegistry: this.componentRegistry,
      artDirection: artDirection.id
    };

    // Phase 5: Format selection - Choose appropriate renderer based on format
    const renderer = this._getRendererForFormat(format);
    const renderedContent = renderer.render(normalizedData, context);

    // Phase 6: Global styles composition - Generate email-safe CSS
    const globalStyles = this.rendererBase.composeGlobalStyles(
      resolvedAccent, format, collectionId
    );

    // Phase 7: Final HTML assembly - Complete email signature
    const finalHtml = this._assembleEmailHTML(
      normalizedData, globalStyles, renderedContent, collection
    );

    return finalHtml;
  }

  _getRendererForFormat(format) {
    const rendererMap = {
      'gmail': this.gmailRenderer,
      'outlook': this.outlookRenderer,
      'universal': this.universalRenderer,
      'default': this.gmailRenderer
    };
    return rendererMap[format] || rendererMap.default;
  }

  _assembleEmailHTML(normalizedData, globalStyles, renderedContent, collection) {
    return `
      <html>
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <title>${escapeHTML(normalizedData.name)} - Email Signature</title>
          <style>
            ${globalStyles}
            ${collection.css || ''}
          </style>
        </head>
        <body class="gmail-signature">
          ${renderedContent}
        </body>
      </html>
    `;
  }

  // Public API for integration
  getSystemStatus() {
    return {
      architecture: 'DESIGN_LANGUAGE_SYSTEM',
      layers: ['Data', 'Design', 'Render'],
      components: ['Avatar', 'Name', 'Title', 'Company', 'Contact', 'Social', 'Divider', 'Branding'],
      registry: {
        artDirections: this.renderRegistry.getAllArtDirections(),
        collections: ['signature'],
        isSignatureActive: true,
        defaultArtDirection: 'signature'
      },
      accentSystem: {
        tokens: this.accentSystem.registrar,
        active: 'signature'
      },
      branding: {
        enabled: this.branding.brandingEnabled,
        variant: this.branding.variant,
        position: this.branding.position
      },
      status: 'OPERATIONAL',
      compatibility: {
        emailClients: ['gmail', 'outlook', 'apple_mail', 'yahoo', 'thunderbird'],
        hasLegacyFallback: true,
        notes: ['All signatures follow the Signature Design Language']
      }
    };
  }
}

// Module exports
const dslSystem = new EmailSignatureDesignLanguageSystem();
export const generateEmailHTML = (profileData, format = 'gmail') => {
  return dslSystem.generateEmailHTML(profileData, format);
};
export { getSocialIcon };
