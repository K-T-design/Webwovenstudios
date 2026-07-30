/**
 * Renderer Registry - Manages email renderers for different art directions
 * Arch: LAYER 2 - Art direction discovery and registration
 */

export class RenderRegistry {
  constructor() {
    this.artDirections = new Map();
    this.defaultArtDirection = 'signature';
    this._registerDefaultArtDirections();
  }

  _registerDefaultArtDirections() {
    // Core signature renderer - fully implemented
    this.registerArtDirection('signature', {
      id: 'signature',
      name: 'Signature',
      description: 'Premium email signature design language',
      status: 'COMPLETE',
      version: '2.0.0'
    });
    
    this.registerArtDirection('gallery', {
      id: 'gallery',
      name: 'Gallery',
      description: 'Gallery-style signature with image treatments',
      status: 'COMPLETE',
      version: '1.0.0'
    });
    
    this.registerArtDirection('chairman', {
      id: 'chairman',
      name: 'Chairman',
      description: 'Executive-style signature with enhanced typography',
      status: 'COMPLETE',
      version: '1.0.0'
    });
    
    this.registerArtDirection('monarch', {
      id: 'monarch',
      name: 'Monarch',
      description: 'Luxury signature with rich typography and accents',
      status: 'COMPLETE',
      version: '1.0.0'
    });
    
    this.registerArtDirection('canvas', {
      id: 'canvas',
      name: 'Canvas',
      description: 'Artistic signature with creative layouts',
      status: 'COMPLETE',
      version: '1.0.0'
    });
    
    this.registerArtDirection('aurora', {
      id: 'aurora',
      name: 'Aurora',
      description: 'Modern signature with dynamic color treatments',
      status: 'COMPLETE',
      version: '1.0.0'
    });
  }

  registerArtDirection(id, definition) {
    const normalized = {
      id,
      name: definition.name || id,
      description: definition.description || '',
      status: definition.status || 'PLACEHOLDER',
      version: definition.version || '1.0.0',
      enabled: true
    };
    
    this.artDirections.set(id, normalized);
    return normalized;
  }

  getArtDirection(id) {
    return this.artDirections.get(id) || this.artDirections.get(this.defaultArtDirection);
  }

  getAllArtDirections() {
    return Array.from(this.artDirections.values());
  }

  getAvailableArtDirections() {
    return this.getAllArtDirections().filter(ad => ad.enabled);
  }

  getCompleteArtDirections() {
    return this.getAllArtDirections().filter(ad => ad.status === 'COMPLETE');
  }
}