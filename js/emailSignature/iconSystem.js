/**
 * Icon System - Centralized icon styling and management
 * Arch: SHARED - Manages all icon rendering across components
 */

import { emailIconImg } from '../utils/cardIcons.js';

export class IconSystem {
  constructor() {
    this.registry = new Map();
    this.defaultSize = 20;
    this.initDefaultRegistry();
  }

  initDefaultRegistry() {
    this.registry.set('email', {
      icon: 'email',
      size: this.defaultSize,
      color: 'inherit',
      strokeWidth: 0,
      rotate: 0,
      class: 'icon-email'
    });
    
    this.registry.set('phone', {
      icon: 'phone',
      size: this.defaultSize,
      color: 'inherit',
      strokeWidth: 0,
      rotate: 0,
      class: 'icon-phone'
    });
    
    this.registry.set('linkedin', {
      icon: 'linkedin',
      size: this.defaultSize,
      color: 'inherit',
      strokeWidth: 0,
      rotate: 0,
      class: 'icon-linkedin'
    });
    
    this.registry.set('twitter', {
      icon: 'twitter',
      size: this.defaultSize,
      color: 'inherit',
      strokeWidth: 0,
      rotate: 0,
      class: 'icon-twitter'
    });
    
    this.registry.set('github', {
      icon: 'github',
      size: this.defaultSize,
      color: 'inherit',
      strokeWidth: 0,
      rotate: 0,
      class: 'icon-github'
    });
    
    this.registry.set('custom', {
      icon: 'custom',
      size: this.defaultSize,
      color: 'inherit',
      strokeWidth: 0,
      rotate: 0,
      class: 'icon-custom'
    });
  }

  render(platform, context) {
    const config = this.registry.get(platform.toLowerCase()) || this.registry.get('custom');
    const accentColor = context.accentColor || '#347dc7';
    
    const styledIcon = emailIconImg(config.icon, config.icon, {
      size: config.size,
      color: accentColor,
      strokeWidth: config.strokeWidth,
      rotate: config.rotate,
      class: config.class
    });
    
    return styledIcon;
  }

  register(platform, config) {
    const normalizedConfig = {
      icon: config.icon || platform,
      size: config.size || this.defaultSize,
      color: config.color || 'inherit',
      strokeWidth: config.strokeWidth || 0,
      rotate: config.rotate || 0,
      class: config.class || `icon-${platform}`
    };
    
    this.registry.set(platform.toLowerCase(), normalizedConfig);
    return normalizedConfig;
  }

  get(platform) {
    return this.registry.get(platform.toLowerCase()) || this.registry.get('custom');
  }

  getAll() {
    return Array.from(this.registry.values());
  }
}