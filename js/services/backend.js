/**
 * Service for communicating with Google Apps Script Backend
 */

const GAS_WEB_APP_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'; // User will need to provide this

export class BackendService {
  /**
   * General request helper
   */
  static async request(action, data = {}) {
    if (GAS_WEB_APP_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
      console.warn('Backend URL not configured. Mocking response for:', action);
      return this.mockResponse(action, data);
    }

    try {
      const response = await fetch(GAS_WEB_APP_URL, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, ...data })
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const result = await response.json();
      if (result.error) throw new Error(result.error);
      
      return result;
    } catch (error) {
      console.error(`Backend Error (${action}):`, error);
      throw error;
    }
  }

  /**
   * Profile CRUD Operations
   */
  static async saveProfile(profileData) {
    const data = {
      ...profileData,
      lastUpdated: new Date().toISOString()
    };
    if (!data.createdAt) data.createdAt = data.lastUpdated;
    
    return this.request('saveProfile', { profile: data });
  }

  static async loadProfile(id) {
    return this.request('loadProfile', { id });
  }

  static async deleteProfile(id) {
    return this.request('deleteProfile', { id });
  }

  static async listProfiles() {
    return this.request('listProfiles');
  }

  /**
   * Image Upload
   * Note: GAS handles base64 data in the JSON payload
   */
  static async uploadImage(base64Data, fileName) {
    return this.request('uploadImage', { 
      base64: base64Data, 
      fileName: fileName 
    });
  }

  /**
   * Mock responses for development without a configured backend
   */
  static async mockResponse(action, data) {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
    
    switch (action) {
      case 'saveProfile':
        return { success: true, id: data.profile.id || 'mock-' + Date.now() };
      case 'loadProfile':
        return { success: true, profile: { ...data, name: 'Loaded Profile' } };
      case 'uploadImage':
        // Return a mock public URL
        return { success: true, url: data.base64 }; // Just return the base64 for preview in mock mode
      default:
        return { success: true };
    }
  }
}
