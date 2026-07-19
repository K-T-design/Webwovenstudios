export const generateStandaloneHTML = (cardElement, state) => {
  // Clone the card to avoid modifying the actual DOM
  const clone = cardElement.cloneNode(true);

  // Escape user-controlled values used in document head/attributes
  const escapeHTML = (str) => String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  
  // Extract applied inline styles and data attributes for the standalone version
  const accentColor = state.accentColor;
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHTML(state.name)} - Profile Card</title>
  <style>
    /* Base reset */
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: #f8f9fa;
      padding: 20px;
    }
    
    /* Core Card Styles */
    .profile-card {
      background: #ffffff;
      color: #1a1a1a;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      border: 1px solid rgba(0, 0, 0, 0.05);
      --card-accent: ${accentColor};
    }
    
    .profile-card[data-size="standard"] { max-width: 400px; min-height: 500px; }
    .profile-card[data-size="compact"] { max-width: 320px; min-height: 450px; }
    .profile-card[data-size="large"] { max-width: 600px; min-height: 600px; }
    .profile-card[data-size="signature"] { 
      max-width: 600px; 
      min-height: auto;
      flex-direction: row; 
      align-items: center; 
      border-radius: 12px; 
      box-shadow: 0 4px 12px rgba(0,0,0,0.05); 
      border: 1px solid #dee2e6; 
    }
    
    .profile-card[data-orientation="vertical"] { flex-direction: column; }
    .profile-card[data-orientation="horizontal"] { flex-direction: row; }
    
    .profile-card[data-theme="dark"] {
      background: #121212;
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .card-header {
      background: linear-gradient(135deg, var(--card-accent), #e85d04);
      height: 140px;
      position: relative;
    }
    
    .profile-card[data-orientation="horizontal"] .card-header { height: auto; width: 160px; flex-shrink: 0; }
    .profile-card[data-size="signature"] .card-header { display: none; }
    
    .card-avatar {
      width: 120px; height: 120px; border-radius: 20px; border: 6px solid #fff;
      background: #f1f3f5; position: absolute; bottom: -60px; left: 32px; overflow: hidden;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    .profile-card[data-theme="dark"] .card-avatar { border-color: #121212; background: #1e1e1e; }
    .profile-card[data-orientation="horizontal"] .card-avatar { position: static; margin: 32px; width: 100px; height: 100px; }
    .profile-card[data-alignment="center"] .card-avatar { left: 50%; transform: translateX(-50%); }
    .card-avatar img { width: 100%; height: 100%; object-fit: cover; }
    
    .card-body { padding: 80px 32px 32px; flex: 1; display: flex; flex-direction: column; }
    .profile-card[data-orientation="horizontal"] .card-body { padding: 32px; }
    .profile-card[data-alignment="center"] .card-body { text-align: center; }
    .profile-card[data-size="signature"] .card-body { padding: 24px; }
    
    .card-name { font-size: 1.75rem; font-weight: 800; margin-bottom: 6px; line-height: 1.1; letter-spacing: -0.02em; }
    .card-title { font-size: 1.1rem; color: var(--card-accent); font-weight: 700; margin-bottom: 6px; }
    .card-company { font-size: 0.95rem; color: #666; margin-bottom: 24px; font-weight: 500; }
    .profile-card[data-theme="dark"] .card-company { color: #a0a0a0; }
    
    .card-contact { display: flex; flex-direction: column; gap: 10px; margin-top: auto; padding-top: 24px; border-top: 1px solid rgba(0,0,0,0.05); }
    .profile-card[data-theme="dark"] .card-contact { border-top-color: rgba(255,255,255,0.05); }
    .profile-card[data-alignment="center"] .card-contact { align-items: center; }
    .contact-item { display: flex; align-items: center; gap: 12px; font-size: 0.95rem; color: #666; text-decoration: none; }
    .profile-card[data-theme="dark"] .contact-item { color: #a0a0a0; }
    .contact-item i { color: var(--card-accent); width: 20px; font-size: 1.1rem; text-align: center; }
    
    .card-social { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 24px; }
    .profile-card[data-alignment="center"] .card-social { justify-content: center; }
    .social-item { width: 40px; height: 40px; border-radius: 12px; background: #f8f9fa; color: #1a1a1a; display: flex; align-items: center; justify-content: center; text-decoration: none; border: 1px solid rgba(0,0,0,0.03); font-size: 1.2rem; }
    .profile-card[data-theme="dark"] .social-item { background: rgba(255,255,255,0.05); color: #fff; }
  </style>
</head>
<body>
  ${clone.outerHTML}
</body>
</html>`;

  return html;
};
