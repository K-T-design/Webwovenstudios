/**
 * Design Layer - Email Art Direction Registry and Collection Management
 * Arch: LAYER 2 - Design specifications and asset registry
 */

import { getCollection } from '../config/constants.js';

export class DesignLayer {
  constructor() {
    this.registry = new Map();
    this.defaultCollectionId = 'signature';
    this.initDefaultRegistry();
  }

  initDefaultRegistry() {
    const defaultCollection = getCollection(this.defaultCollectionId);
    if (defaultCollection) {
      this.registerCollection(this.defaultCollectionId, defaultCollection);
    } else {
      // Fallback to minimal valid collection definition
      this.registerCollection(this.defaultCollectionId, this.createFallbackCollection());
    }
  }

  registerCollection(id, collectionDef) {
    const normalized = {
      id,
      name: collectionDef.name || id,
      description: collectionDef.description || '',
      version: collectionDef.version || '1.0.0',
      tokens: collectionDef.tokens || {},
      css: collectionDef.css || '',
      breakpoints: collectionDef.breakpoints || {},
      assets: collectionDef.assets || {}
    };
    
    this.registry.set(id, normalized);
    return normalized;
  }

  getCollection(collectionId) {
    return this.registry.get(collectionId) || this.registry.get(this.defaultCollectionId);
  }

  getRegistry() {
    return Array.from(this.registry.values());
  }

  createFallbackCollection() {
    return {
      id: this.defaultCollectionId,
      name: 'Signature',
      description: 'Premium email signature design language',
      tokens: {
        emailAccent: '#347dc7',
        background: '#ffffff',
        surface: '#ffffff',
        textPrimary: '#000000',
        textSecondary: '#666666',
        divider: '#dddddd'
      },
      css: `
        :root {
          --avatar-border-radius: 50%;
          --avatar-border-width: 3px;
          --avatar-border-color: #ffffff;
          --avatar-shadow: 0 1px 3px rgba(0,0,0,0.2);
          --name-font-size: 16px;
          --name-font-weight: 700;
          --name-color: #000000;
          --title-font-size: 14px;
          --title-font-weight: 400;
          --title-color: var(--email-accent, #347dc7);
          --company-font-size: 12px;
          --company-color: #666666;
          --contact-font-size: 12px;
          --contact-color: #555555;
          --social-margin-top: 10px;
          --signature-padding: 15px;
          --separator-height: 1px;
          --separator-color: #dddddd;
          --accent-icon-color: var(--email-accent, #347dc7);
        }
      `,
      assets: {
        avatars: {
          default: {
            width: 80,
            height: 80,
            borderRadius: '50%',
            borderWidth: 3,
            borderColor: '#ffffff',
            shadow: '0 1px 3px rgba(0,0,0,0.2)',
            objectFit: 'cover'
          }
        }
      }
    };
  }
}