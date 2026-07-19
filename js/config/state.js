import { DEFAULT_PROFILE } from './constants.js';

class StateManager {
  constructor() {
    this.state = { 
      ...DEFAULT_PROFILE,
      isLoading: false,
      error: null
    };
    this.listeners = [];
  }

  // Subscribe to state changes
  subscribe(listener) {
    this.listeners.push(listener);
    // Initial call
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Update specific keys in state
  update(updates) {
    this.state = { ...this.state, ...updates };
    this.notify();
  }

  // Helper for dynamic social links
  updateSocialLink(index, updates) {
    const socialLinks = [...this.state.socialLinks];
    socialLinks[index] = { ...socialLinks[index], ...updates };
    this.update({ socialLinks });
  }

  addSocialLink(platform = "website") {
    const socialLinks = [...this.state.socialLinks, { platform, url: "", enabled: true }];
    this.update({ socialLinks });
  }

  removeSocialLink(index) {
    const socialLinks = this.state.socialLinks.filter((_, i) => i !== index);
    this.update({ socialLinks });
  }

  reorderSocialLinks(fromIndex, toIndex) {
    const socialLinks = [...this.state.socialLinks];
    const [movedItem] = socialLinks.splice(fromIndex, 1);
    socialLinks.splice(toIndex, 0, movedItem);
    this.update({ socialLinks });
  }

  // Get current state
  get() {
    return this.state;
  }

  // Set loading state
  setLoading(isLoading) {
    this.update({ isLoading });
  }

  // Set error state
  setError(error) {
    this.update({ error });
  }

  // Reset to default
  reset() {
    this.state = { 
      ...DEFAULT_PROFILE,
      isLoading: false,
      error: null
    };
    this.notify();
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }
}

export const appState = new StateManager();
