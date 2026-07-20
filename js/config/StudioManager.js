/**
 * Studio Manager (WebWoven Studios)
 * ----------------------------------------------------------------------------
 * The SINGLE AUTHORITY for every design-system object: Collections, Themes,
 * Templates, and Animation Packs. Every other module queries the Studio Manager
 * instead of reaching into registries directly, so the registration contract, the
 * collection-CSS loading strategy, and the asset-resolution rules live in ONE place
 * (ARCHITECTURE §1, §17, §37).
 *
 * Relationship to constants.js:
 *   The raw registries (COLLECTIONS, THEMES, TEMPLATES, ANIMATION_PACKS)
 *   remain defined in constants.js as the data source. The Studio Manager imports
 *   them, exposes authoritative lookup/registration, and owns the *behavior* around
 *   them (lazy CSS loading, asset resolution, compatibility checks). This keeps data
 *   declarative and logic centralized — the registry pattern from ARCHITECTURE §37.
 *
 * Why a manager and not direct registry access everywhere:
 *   - Registration is centralized (one addCollection vs. scattered pushes).
 *   - Collection CSS loading (the chosen strategy, see loadCollectionCss) is a single
 *     implementation, not re-implemented per consumer.
 *   - Future Studio expansion (multiple Studios, remote registries) changes only this file.
 *
 * This module is PURE DATA + LOADING. It never renders, never touches the DOM
 * beyond fetching CSS text, and never imports components (no circular deps).
 */

import {
  COLLECTIONS,
  THEMES,
  TEMPLATES,
  ANIMATION_PACKS,
  getCollection,
  getTheme,
  getTemplate,
  getCollectionTokens
} from './constants.js';

class StudioManager {
  constructor() {
    // Live registries. Seeded from constants.js; registration mutates these.
    this._collections = [...COLLECTIONS];
    this._themes = [...THEMES];
    this._templates = [...TEMPLATES];
    this._animationPacks = [...ANIMATION_PACKS];

    // In-memory cache of loaded collection CSS text (keyed by collection id).
    // Populated by loadCollectionCss(); consumed by the Export Engine composer.
    this._collectionCssCache = {};

    // Asset registry: collectionId -> resolved asset map. Populated by registerAssets().
    this._assets = {};

    // Studio-level metadata (single Studio for now; expandable later).
    this._studio = {
      id: 'webwoven',
      name: 'WebWoven Studios',
      version: '1.0.0'
    };
  }

  /* ---------------------------------------------------------------- Studio */

  getStudio() {
    return { ...this._studio };
  }

  /* ---------------------------------------------------------- Collections */

  /** Authoritative collection lookup (falls back to signature for safety). */
  getCollection(id) {
    return getCollection(id) || getCollection('signature');
  }

  /** All registered collections (for future selection UIs / iteration). */
  getCollections() {
    return [...this._collections];
  }

  /** Register a new Collection at runtime (future Studios / remote registries). */
  registerCollection(def) {
    if (!def || !def.id) throw new Error('Collection requires an id');
    const existing = this._collections.find(c => c.id === def.id);
    if (existing) {
      Object.assign(existing, def); // merge — never duplicate
    } else {
      this._collections.push(def);
    }
    return this;
  }

  /** Tokens for a collection (delegates to constants helper). */
  getCollectionTokens(id) {
    return getCollectionTokens(id);
  }

  /**
   * COLLECTION CSS LOADING STRATEGY (ARCHITECTURE §38, Task 9).
   * ------------------------------------------------------------------
   * CHOSEN: LAZY + CACHED per-collection CSS.
   *
   * Why lazy (not bundled):
   *   The editor must stay lean. With 50+ Collections planned, shipping every
   *   collection's CSS to every user is wasteful and harms LCP. Lazy loading means
   *   only the ACTIVE collection's CSS is fetched — and only once (cached).
   *
   * Why cached (not re-fetched):
   *   Switching collections / re-exporting reuses the cached text. Zero redundant
   *   network cost after first load.
   *
   * Why text-inlined into export (not @import):
   *   The Export Engine cannot rely on relative @import inside iframe/email
   *   contexts. It inlines the resolved CSS string (see export.js COLLECTION_STYLES).
   *   This is exactly the "same rendering pipeline" guarantee (ARCHITECTURE §7).
   *
   * Signature collection: its CSS is already covered by BASE_CARD_CSS in export.js,
   * so we do NOT fetch it (the cache stays empty for 'signature' and export falls
   * back to BASE_CARD_CSS → output identical to today).
   *
   * @param {string} id - collection id
   * @param {string} [basePath='css/'] - path prefix for collection css files
   * @returns {Promise<string>} the collection's CSS text ('' for signature/none)
   */
  async loadCollectionCss(id, basePath = 'css/') {
    const collection = this.getCollection(id);
    const cssFile = collection && collection.css ? collection.css : '';

    // Signature (and any collection without a css file) contributes no extra CSS;
    // BASE_CARD_CSS in export.js already reproduces the look. Return '' → identical output.
    if (!cssFile) {
      this._collectionCssCache[id] = '';
      return '';
    }

    if (this._collectionCssCache[id] !== undefined) {
      return this._collectionCssCache[id]; // cached
    }

    try {
      const res = await fetch(`${basePath}${cssFile}`);
      const text = res.ok ? await res.text() : '';
      this._collectionCssCache[id] = text;
      return text;
    } catch (e) {
      // Network/asset failure must NEVER break the card. Fall back to base.
      this._collectionCssCache[id] = '';
      return '';
    }
  }

  /** Synchronous read of the cached collection CSS (for the Export Engine). */
  getCollectionCss(id) {
    return this._collectionCssCache[id] || '';
  }

  /* -------------------------------------------------------------- Themes */

  getTheme(id) {
    return getTheme(id) || getTheme('light');
  }

  getThemes() {
    return [...this._themes];
  }

  registerTheme(def) {
    if (!def || !def.id) throw new Error('Theme requires an id');
    const existing = this._themes.find(t => t.id === def.id);
    if (existing) Object.assign(existing, def);
    else this._themes.push(def);
    return this;
  }

  /** Whether a theme is compatible with a collection (ARCHITECTURE §19). */
  isThemeCompatible(collectionId, themeId) {
    const c = this.getCollection(collectionId);
    if (!c || !Array.isArray(c.supportedThemes)) return true; // unknown => permissive
    return c.supportedThemes.includes(themeId);
  }

  /* ----------------------------------------------------------- Templates */

  getTemplate(id) {
    return getTemplate(id) || getTemplate('standard');
  }

  getTemplates() {
    return [...this._templates];
  }

  registerTemplate(def) {
    if (!def || !def.id) throw new Error('Template requires an id');
    const existing = this._templates.find(t => t.id === def.id);
    if (existing) Object.assign(existing, def);
    else this._templates.push(def);
    return this;
  }

  /** Whether a template is compatible with a collection (ARCHITECTURE §20). */
  isTemplateCompatible(collectionId, templateId) {
    const c = this.getCollection(collectionId);
    if (!c || !Array.isArray(c.templates)) return true;
    return c.templates.includes(templateId);
  }

  /* ------------------------------------------------------ Animation Packs */

  getAnimationPack(id) {
    if (!id) return null;
    return this._animationPacks.find(p => p.id === id) || null;
  }

  getAnimationPacks() {
    return [...this._animationPacks];
  }

  registerAnimationPack(def) {
    if (!def || !def.id) throw new Error('Animation Pack requires an id');
    const existing = this._animationPacks.find(p => p.id === def.id);
    if (existing) Object.assign(existing, def);
    else this._animationPacks.push(def);
    return this;
  }

  /**
   * Resolve the animation pack for a collection, honoring the global motion gate.
   * Returns the pack id to apply, or '' when motion is disabled / reduced /
   * unsupported. This is the single decision point the AnimationEngine consults.
   */
  resolveAnimationPack(collectionId, { animationsEnabled = true, reducedMotion = false } = {}) {
    const c = this.getCollection(collectionId);
    const packId = c ? c.animationPack : '';
    if (!packId) return '';
    if (!animationsEnabled || reducedMotion) return '';
    const pack = this.getAnimationPack(packId);
    if (!pack || pack.exportCompatible === false) return packId; // still apply in preview
    return packId;
  }

  /* ------------------------------------------------------------- Assets */

  /**
   * COLLECTION ASSETS SYSTEM (Task 6).
   * Register a collection's asset manifest. The manifest declares WHAT assets a
   * collection MAY use (css, fonts, decorative, svg, icons, textures,
   * backgrounds, animationFiles, sounds, models3d). No assets are added in
   * this phase — only the registration contract exists so future collections
   * register assets declaratively and the loader resolves them uniformly.
   */
  registerAssets(collectionId, manifest = {}) {
    this._assets[collectionId] = {
      css: manifest.css || null,
      fonts: manifest.fonts || [],
      decorative: manifest.decorative || [],
      svg: manifest.svg || [],
      icons: manifest.icons || [],
      textures: manifest.textures || [],
      backgrounds: manifest.backgrounds || [],
      animationFiles: manifest.animationFiles || [],
      sounds: manifest.sounds || [],         // future
      models3d: manifest.models3d || []   // future
    };
    return this;
  }

  getAssets(collectionId) {
    return this._assets[collectionId] || null;
  }

  /* --------------------------------------------------- Collection Preview */

  /**
   * COLLECTION PREVIEW SYSTEM (Task 7).
   * Returns the preview metadata a future Collection tile will render. This phase
   * defines the SHAPE only — no actual preview designs are created. Each
   * collection entry already carries thumbnail/preview/cover/description/motion
   * metadata; this accessor normalizes it for a future selection UI.
   */
  getCollectionPreview(id) {
    const c = this.getCollection(id);
    if (!c) return null;
    return {
      id: c.id,
      name: c.name,
      description: c.description || '',
      philosophy: c.philosophy || '',
      bestFor: c.bestFor || [],
      motionLevel: c.motionLevel || 'static',
      motionLabel: c.motionLabel || 'Minimal Motion',
      thumbnail: c.thumbnail || '',
      preview: c.preview || '',
      cover: c.cover || '',
      premium: !!c.premium,
      locked: !!c.locked,
      version: c.version || '1.0.0',
      compatibleThemes: c.supportedThemes || [],
      compatibleTemplates: c.templates || []
    };
  }
}

/** The single shared Studio Manager instance (authority for the whole app). */
export const studio = new StudioManager();

/** Re-export the raw registries for any module that still imports them directly. */
export {
  COLLECTIONS,
  THEMES,
  TEMPLATES,
  ANIMATION_PACKS,
  getCollection,
  getTheme,
  getTemplate,
  getCollectionTokens
} from './constants.js';

export default studio;
