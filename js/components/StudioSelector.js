/**
 * Studio Selector (WebWoven Studios)
 * ----------------------------------------------------------------------------
 * Exposes the Collection framework to the user as a premium "design preset"
 * browser — premium Studio cards instead of a dropdown — fully driven by the
 * StudioManager registry (ARCHITECTURE §1, §18, §37). Nothing here hardcodes a
 * collection, theme, or template; every tile, label, and compatibility state is
 * resolved from the registry.
 *
 * Responsibilities:
 *   - Render a premium tile per registered Collection (cover, name, description,
 *     motion indicator, premium badge, recommended use) from getCollectionPreview().
 *   - Render Theme options from getThemes(), disabling those NOT compatible with
 *     the active collection (studio.isThemeCompatible).
 *   - Render Template options from getTemplates(), disabling those NOT compatible
 *     (studio.isTemplateCompatible).
 *   - On collection select, update appState.collection. The existing PreviewEngine
 *     subscription re-renders the live preview in real time (no reload). This module
 *     then re-applies theme/template compatibility for the new collection.
 *
 * This module is VIEW-ONLY for selection; it never renders the card itself and never
 * touches export logic. It reads from `studio` and writes to `appState`.
 */

import { $, $$, sanitizeHTML } from '../utils/dom.js';
import { appState } from '../config/state.js';
import { studio } from '../config/StudioManager.js';

export class StudioSelector {
  constructor() {
    this.containers = {
      collections: $('#studioCollections'),
      themes: $('#studioThemes'),
      templates: $('#studioTemplates')
    };
    this.init();
  }

  init() {
    if (!this.containers.collections) return; // Studio section not present in DOM
    this.renderCollections();
    this.renderThemes();
    this.renderTemplates();
    this.bindCollectionSelection();
    this.syncSelectionFromState();

    // Keep the selector in sync if state changes elsewhere (e.g. reset).
    appState.subscribe((state) => this.syncSelectionFromState(state));
  }

  /* ------------------------------------------------------ Collections (tiles) */

  renderCollections() {
    const root = this.containers.collections;
    if (!root) return;
    const collections = studio.getCollections();

    root.innerHTML = collections.map((c) => {
      const preview = studio.getCollectionPreview(c.id);
      const tokens = studio.getCollectionTokens(c.id) || {};
      const accent = tokens['--card-accent'] || '#c92a2a';
      const accent2 = tokens['--card-accent-2'] || '#e85d04';
      const useCases = (preview.bestFor || []).slice(0, 3)
        .map((b) => `<span class="studio-chip">${sanitizeHTML(b)}</span>`).join('');
      const premium = preview.premium
        ? `<span class="studio-badge">Premium</span>` : '';

      return `
        <button type="button" class="studio-tile" data-type="collection" data-value="${c.id}"
                role="button" aria-pressed="false" tabindex="0"
                style="--tile-accent:${sanitizeHTML(accent)};--tile-accent-2:${sanitizeHTML(accent2)};">
          <span class="studio-tile-cover" aria-hidden="true">
            <span class="studio-tile-cover-card">
              <span class="studio-tile-cover-bar"></span>
              <span class="studio-tile-cover-name">${sanitizeHTML(preview.name)}</span>
              <span class="studio-tile-cover-role">${sanitizeHTML(preview.motionLabel)}</span>
            </span>
            ${premium}
          </span>
          <span class="studio-tile-body">
            <span class="studio-tile-head">
              <span class="studio-tile-name">${sanitizeHTML(preview.name)}</span>
              <span class="studio-tile-motion" title="Motion style">
                <span class="studio-tile-motion-dot"></span>${sanitizeHTML(preview.motionLabel)}
              </span>
            </span>
            <span class="studio-tile-desc">${sanitizeHTML(preview.description)}</span>
            <span class="studio-tile-uses">${useCases}</span>
          </span>
        </button>`;
    }).join('');
  }

  /* ------------------------------------------------------------- Themes */

  renderThemes() {
    const root = this.containers.themes;
    if (!root) return;
    const themes = studio.getThemes();
    const active = appState.get().collection || 'signature';

    root.innerHTML = themes.map((t) => {
      const compatible = studio.isThemeCompatible(active, t.id);
      return `
        <div class="option-card studio-option ${compatible ? '' : 'studio-option--disabled'}"
             data-type="theme" data-value="${t.id}" role="button" tabindex="${compatible ? '0' : '-1'}"
             aria-disabled="${compatible ? 'false' : 'true'}">
          <i>${this._themeGlyph(t.id)}</i>
          <div class="option-title">${sanitizeHTML(t.name)}</div>
        </div>`;
    }).join('');
  }

  /* ---------------------------------------------------------- Templates */

  renderTemplates() {
    const root = this.containers.templates;
    if (!root) return;
    const templates = studio.getTemplates();
    const active = appState.get().collection || 'signature';

    root.innerHTML = templates.map((t) => {
      const compatible = studio.isTemplateCompatible(active, t.id);
      return `
        <div class="option-card studio-option ${compatible ? '' : 'studio-option--disabled'}"
             data-type="template" data-value="${t.id}" role="button" tabindex="${compatible ? '0' : '-1'}"
             aria-disabled="${compatible ? 'false' : 'true'}">
          <i>${this._templateGlyph(t.id)}</i>
          <div class="option-title">${sanitizeHTML(t.name)}</div>
        </div>`;
    }).join('');
  }

  /* --------------------------------------------- Selection + compatibility */

  bindCollectionSelection() {
    const root = this.containers.collections;
    if (!root) return;
    root.addEventListener('click', (e) => {
      const tile = e.target.closest('.studio-tile');
      if (tile) this.selectCollection(tile.dataset.value);
    });
    root.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
      const tile = e.target.closest && e.target.closest('.studio-tile');
      if (tile) { e.preventDefault(); this.selectCollection(tile.dataset.value); }
    });
  }

  selectCollection(id) {
    if (!id) return;
    // Update state → PreviewEngine re-renders the live preview in real time.
    appState.update({ collection: id });
    // Re-apply theme/template compatibility for the newly active collection.
    this.renderThemes();
    this.renderTemplates();
    this.syncSelectionFromState();
  }

  /** Reflect current appState onto the selector (selection highlight + disabled states). */
  syncSelectionFromState(state = appState.get()) {
    const activeCollection = state.collection || 'signature';

    // Highlight the active collection tile.
    this.containers.collections?.querySelectorAll('.studio-tile').forEach((tile) => {
      const on = tile.dataset.value === activeCollection;
      tile.classList.toggle('studio-tile--active', on);
      tile.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    // Reflect theme/template selection (the generic option-card handler manages
    // .selected, but we re-assert it here so reset() restores correctly).
    ['theme', 'template'].forEach((type) => {
      const value = state[type];
      if (!value) return;
      $$(`.option-card[data-type="${type}"]`).forEach((c) => {
        c.classList.toggle('selected', c.dataset.value === value);
      });
    });

    // Disable incompatible theme/template cards (registry-driven, no hardcode).
    const themesRoot = this.containers.themes;
    if (themesRoot) {
      themesRoot.querySelectorAll('.studio-option').forEach((c) => {
        const ok = studio.isThemeCompatible(activeCollection, c.dataset.value);
        c.classList.toggle('studio-option--disabled', !ok);
        c.setAttribute('aria-disabled', ok ? 'false' : 'true');
        c.setAttribute('tabindex', ok ? '0' : '-1');
      });
    }
    const tplRoot = this.containers.templates;
    if (tplRoot) {
      tplRoot.querySelectorAll('.studio-option').forEach((c) => {
        const ok = studio.isTemplateCompatible(activeCollection, c.dataset.value);
        c.classList.toggle('studio-option--disabled', !ok);
        c.setAttribute('aria-disabled', ok ? 'false' : 'true');
        c.setAttribute('tabindex', ok ? '0' : '-1');
      });
    }
  }

  /* ------------------------------------------------------------- Glyphs */

  _themeGlyph(id) {
    return { light: '☀️', dark: '🌙', glass: '🪟', 'dark-glass': '🌌' }[id] || '◐';
  }

  _templateGlyph(id) {
    return {
      standard: '🔲', compact: '📱', large: '🖥️',
      signature: '✉️', horizontal: '↔️'
    }[id] || '▦';
  }
}
