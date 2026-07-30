/**
 * Data Layer - Email Signature Data Normalization and Sanitization
 * Arch: LAYER 1 - Raw input → sanitized export data
 */

import { escapeHTML, safeURL, sanitizeSocialLinks } from './utils/emailExporterUtils.js';

export class DataLayer {
  constructor() {
    this.invariants = {
      NAME_MAX_LENGTH: 50,
      TITLE_MAX_LENGTH: 30,
      COMPANY_MAX_LENGTH: 50,
      THEME_DEFAULT: 'default',
      COLLECTION_DEFAULT: 'signature'
    };
  }

  normalize(profileData) {
    if (!profileData || typeof profileData !== 'object') {
      profileData = {};
    }

    const normalized = {
      // Core identity data
      name: this._sanitizeString(profileData.name, this.invariants.NAME_MAX_LENGTH, ''),
      jobTitle: this._sanitizeString(profileData.jobTitle, this.invariants.TITLE_MAX_LENGTH, ''),
      company: this._sanitizeString(profileData.company, this.invariants.COMPANY_MAX_LENGTH, ''),
      
      // Contact information
      email: this._sanitizeString(profileData.email, 100, '').toLowerCase(),
      phone: this._sanitizePhone(profileData.phone),
      
      // Assets
      imageUrl: this._sanitizeImage(profileData.imageUrl),
      
      // Social links
      socialLinks: this._sanitizeSocialLinks(profileData.socialLinks || []),
      
      // Design system integration
      theme: profileData.theme || this.invariants.THEME_DEFAULT,
      collection: profileData.collection || this.invariants.COLLECTION_DEFAULT,
      
      // Accent handling - will be resolved by AccentSystem
      accentColor: profileData.accentColor || null
    };

    return normalized;
  }

  _sanitizeString(value, maxLength, fallback) {
    if (typeof value !== 'string') return fallback;
    const sanitized = escapeHTML(value.trim());
    return sanitized.length > maxLength ? sanitized.substring(0, maxLength) : sanitized;
  }

  _sanitizePhone(phone) {
    if (!phone) return '';
    const digits = phone.replace(/[\s\-\(\)\+]/g, '');
    const formatted = `tel:${digits}`;
    return digits.length >= 10 ? formatted : '';
  }

  _sanitizeImage(imageUrl) {
    if (!imageUrl) return '';
    const sanitized = safeURL(imageUrl);
    return sanitized ? sanitized : '';
  }

  _sanitizeSocialLinks(links) {
    return sanitizeSocialLinks(links, {
      urlMaxLength: 200,
      platformMaxLength: 30
    });
  }
}