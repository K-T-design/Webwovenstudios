/**
 * Animation Engine (WebWoven Studios)
 * ----------------------------------------------------------------------------
 * Separates motion from layout (ARCHITECTURE §21, Design Bible §10–§12).
 *
 * Animations are INDEPENDENT MODULES attached to a card via a collection's
 * `animationPack` id. The engine reads the active collection's `animationPack` from the
 * registry and reflects it as a `data-animation-pack="<id>"` attribute on the card. The
 * actual keyframes live in css/animations/*.css and only activate when a pack is assigned.
 *
 * This module is the PLUGGABLE ENGINE, not the animations themselves. Premium motion packs
 * (Editorial Reveal, Aurora, Liquid Morph, Shimmer, Spotlight, Glass Reflection, etc.) are
 * added later as keyframe/selector definitions + registry entries. None are implemented in
 * this phase; the engine simply prepares the pipeline so they drop in without rewrites.
 *
 * Safety: motion is ALWAYS gated by (a) state.animationsEnabled and (b) the user's
 * prefers-reduced-motion setting. When either blocks motion, the attribute is removed so
 * the card resolves to its static end-state (Design Bible §19).
 */

import { appState } from '../config/state.js';
import { studio } from '../config/StudioManager.js';

/** Returns true when the user/OS permits motion. */
const motionAllowed = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return true;
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export class AnimationEngine {
  constructor(container) {
    // container = the card element (#previewCard) whose data-animation-pack is managed.
    this.container = container;
  }

  /**
   * Apply the active collection's animation pack to the card.
   * No-op for collections without a pack (e.g. signature => animationPack: '').
   * The pack id is resolved by the Studio Manager (single authority, ARCHITECTURE §1/§5),
   * which honors the global motion gate and the reduced-motion setting.
   */
  apply(state) {
    if (!this.container) return;

    const packId = studio.resolveAnimationPack(state.collection || 'signature', {
      animationsEnabled: state.animationsEnabled !== false,
      reducedMotion: !motionAllowed()
    });

    if (packId) {
      this.container.dataset.animationPack = packId;
    } else {
      // Remove the attribute entirely so no pack CSS can activate.
      delete this.container.dataset.animationPack;
    }
  }

  /** Subscribe to state changes. Returns an unsubscribe function. */
  init(stateManager = appState) {
    this._unsub = stateManager.subscribe((state) => this.apply(state));
    return () => {
      if (this._unsub) this._unsub();
    };
  }
}

/**
 * Convenience factory used by the App orchestrator.
 * @param {HTMLElement} container - the #previewCard element
 * @param {object} stateManager - the appState singleton
 */
export const initAnimations = (container, stateManager = appState) => {
  const engine = new AnimationEngine(container);
  return engine.init(stateManager);
};
