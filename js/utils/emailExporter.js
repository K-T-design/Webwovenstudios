/**
 * Email Exporter Utilities
 * 
 * This module provides email-compatible HTML generation from profile cards.
 * It supports Gmail, Outlook, and other major email clients with optimized layouts.
 *
 * Email signatures are ALWAYS static (ARCHITECTURE §9): no animation is ever included,
 * because email clients strip or ignore animation. Collection variation is expressed only
 * through static tokens (e.g., an email-accent color) resolved from the registry.
 */

import { getCollection } from '../config/constants.js';

/**
 * Generate email-compatible HTML signature from profile data
 * Optimizes HTML for email clients, especially Gmail
 * 
 * @param {Object} profileData - Complete profile data from appState
 * @param {string} format - Email format: 'gmail', 'outlook', 'universal'
 * @returns {string} Email-compatible HTML
 */
export const generateEmailHTML = (profileData, format = 'gmail') => {
  // Sanitize all user-controlled inputs before interpolation to prevent
  // HTML/attribute injection in the generated email signature.
  const escapeHTML = (str) => String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const safeURL = (url) => {
    if (typeof url !== 'string' || url.trim() === '') return '';
    const u = url.trim();
    if (/^(https?:|mailto:|tel:|data:image\/)/i.test(u)) return u.replace(/"/g, '%22');
    return '';
  };

  const sanitizedLinks = (profileData.socialLinks || [])
    .map(link => ({
      ...link,
      url: safeURL(link.url),
      platform: String(link.platform ?? 'custom')
    }));

  const safeData = {
    name: escapeHTML(profileData.name),
    jobTitle: escapeHTML(profileData.jobTitle),
    company: escapeHTML(profileData.company),
    email: escapeHTML(profileData.email),
    phone: escapeHTML(profileData.phone),
    imageUrl: safeURL(profileData.imageUrl),
    socialLinks: sanitizedLinks,
    theme: profileData.theme,
    accentColor: profileData.accentColor,
    collection: profileData.collection
  };

  const { name, jobTitle, company, email, phone, imageUrl, socialLinks, theme, accentColor, collection } = safeData;

  // Resolve a static email accent from the active collection (ARCHITECTURE §9, §18).
  // Default collections (e.g. 'signature') do not define an emailAccent, so the classic
  // Gmail blue (#1a73e8) is preserved — current email output is unchanged. Future collections
  // may set tokens.emailAccent to brand the signature without animation.
  const collectionDef = getCollection(collection || 'signature');
  const emailAccent = (collectionDef && collectionDef.tokens && collectionDef.tokens.emailAccent) || '#1a73e8';
  
  const emailSafeStyles = `
    body, table, td, p, a { margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 14px; color: #333333; line-height: 1.4; }
    table { border-collapse: collapse; width: 100%; }
    img { display: block; border: 0; max-width: 100%; height: auto; }
    a { color: ${emailAccent}; text-decoration: none; }
    .gmail-signature { background: transparent; }
    .signature-name { font-weight: bold; color: #000000; font-size: 16px; }
    .signature-title { color: ${emailAccent}; font-size: 14px; }
    .signature-company { color: #666666; font-size: 12px; }
    .signature-contact { color: #555555; font-size: 12px; margin-top: 8px; }
    .signature-social { margin-top: 10px; }
    .signature-separator { height: 1px; background-color: #dddddd; margin: 10px 0; }
    @media (max-width: 600px) {
      .signature-container { max-width: 100% !important; }
      .signature-img { width: 60px !important; height: 60px !important; }
    }
  `;

  let html;
  
  switch (format) {
    case 'outlook':
      html = generateOutlookSignature(safeData);
      break;
    case 'universal':
      html = generateUniversalSignature(safeData);
      break;
    case 'gmail':
    default:
      html = generateGmailSignature(safeData);
      break;
  }
  
  return `<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <title>${name} - Email Signature</title>
  <style>
    ${emailSafeStyles}
  </style>
</head>
<body class="gmail-signature">
  ${html}
</body>
</html>`;
};

/**
 * Generate Gmail-optimized signature
 * Removes unsupported CSS and simplifies layout
 */
function generateGmailSignature(profileData) {
  const { name, jobTitle, company, email, phone, imageUrl, socialLinks } = profileData;
  
  return `
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; max-width: 500px;">
      <tr>
        <td width="80" valign="top" style="padding-right: 15px;">
          <img src="${imageUrl}" width="80" height="80" alt="Profile" 
               style="border-radius: 50%; object-fit: cover; border: 3px solid #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.2);" />
        </td>
        <td valign="top">
          <div class="signature-name">${name}</div>
          <div class="signature-title">${jobTitle}</div>
          <div class="signature-company">${company}</div>
          
          ${generateEmailContactInfo(email, phone)}
          
          ${generateEmailSocialLinks(socialLinks)}
        </td>
      </tr>
    </table>
  `;
}

/**
 * Generate Outlook-optimized signature
 * Uses table-based layout for better Outlook compatibility
 */
function generateOutlookSignature(profileData) {
  const { name, jobTitle, company, email, phone, imageUrl, socialLinks } = profileData;
  
  return `
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; max-width: 600px;">
      <tr>
        <td width="120" valign="top" align="center" style="padding-right: 20px;">
          <img src="${imageUrl}" width="120" height="120" alt="Profile" 
               style="border-radius: 50%; object-fit: cover; border: 4px solid #e1e1e1;" />
        </td>
        <td valign="top">
          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
            <tr>
              <td>
                <div class="signature-name" style="font-size: 18px; margin-bottom: 4px;">${name}</div>
                <div class="signature-title" style="color: #2b5797; font-size: 16px; margin-bottom: 6px;">${jobTitle}</div>
                <div class="signature-company" style="color: #666666; font-size: 14px; margin-bottom: 12px;">${company}</div>
              </td>
            </tr>
            ${generateOutlookContactRow(email, phone)}
            ${generateOutlookSocialRow(socialLinks)}
          </table>
        </td>
      </tr>
    </table>
  `;
}

/**
 * Generate universal signature format
 * Balances compatibility across all email clients
 */
function generateUniversalSignature(profileData) {
  const { name, jobTitle, company, email, phone, imageUrl, socialLinks } = profileData;
  
  return `
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; max-width: 550px;">
      <tr>
        <td width="90" valign="top" style="padding-right: 12px;">
          <img src="${imageUrl}" width="90" height="90" alt="Profile" 
               style="border-radius: 50%; object-fit: cover; border: 3px solid #f0f0f0;" />
        </td>
        <td valign="top">
          <div class="signature-name" style="font-weight: bold; color: #333; font-size: 15px; margin-bottom: 3px;">${name}</div>
          <div class="signature-title" style="color: #1a73e8; font-size: 13px; margin-bottom: 4px;">${jobTitle}</div>
          <div class="signature-company" style="color: #666; font-size: 11px; margin-bottom: 8px;">${company}</div>
          
          ${generateUniversalContactInfo(email, phone)}
          
          ${generateUniversalSocialLinks(socialLinks)}
        </td>
      </tr>
    </table>
  `;
}

/**
 * Generate contact information section for Gmail signature
 */
function generateEmailContactInfo(email, phone) {
  if (!email && !phone) return '';
  
  let contacts = [];
  
  if (email) {
    contacts.push(`<a href="mailto:${email}" style="color: #1a73e8;">${email}</a>`);
  }
  
  if (phone) {
    contacts.push(`<a href="tel:${phone}" style="color: #1a73e8;">${phone}</a>`);
  }
  
  if (contacts.length === 0) return '';
  
  return `
    <div class="signature-separator"></div>
    <div class="signature-contact">
      ${contacts.join(' <span style="color: #cccccc;">•</span> ')}
    </div>
  `;
}

/**
 * Generate social links section for Gmail signature
 */
function generateEmailSocialLinks(socialLinks) {
  if (!socialLinks || socialLinks.length === 0) return '';
  
  const enabledLinks = socialLinks.filter(link => link.enabled && link.url);
  
  if (enabledLinks.length === 0) return '';
  
  const socialHtml = enabledLinks.map(link => {
    const platform = link.platform.toLowerCase();
    const icon = getSocialIcon(platform);
    return `<a href="${link.url}" target="_blank" style="display: inline-block; margin-right: 12px; color: #1a73e8; text-decoration: none;">${icon}</a>`;
  }).join('');
  
  return `
    <div class="signature-separator"></div>
    <div class="signature-social">
      ${socialHtml}
    </div>
  `;
}

/**
 * Generate contact information section for Outlook signature
 */
function generateOutlookContactRow(email, phone) {
  if (!email && !phone) return '';
  
  let contacts = [];
  
  if (email) {
    contacts.push(`<b>Email:</b> <a href="mailto:${email}">${email}</a>`);
  }
  
  if (phone) {
    contacts.push(`<b>Phone:</b> <a href="tel:${phone}">${phone}</a>`);
  }
  
  if (contacts.length === 0) return '';
  
  return `
    <tr>
      <td colspan="2" style="padding-top: 10px;">
        <div style="color: #555555; font-size: 13px;">
          ${contacts.join(' <span style="color: #cccccc;">|</span> ')}
        </div>
      </td>
    </tr>
  `;
}

/**
 * Generate social links section for Outlook signature
 */
function generateOutlookSocialRow(socialLinks) {
  if (!socialLinks || socialLinks.length === 0) return '';
  
  const enabledLinks = socialLinks.filter(link => link.enabled && link.url);
  
  if (enabledLinks.length === 0) return '';
  
  const socialHtml = enabledLinks.map(link => {
    const platform = link.platform.toLowerCase();
    const icon = getSocialIcon(platform);
    return `<span style="margin-right: 15px;">${icon}</span>`;
  }).join('');
  
  return `
    <tr>
      <td colspan="2" style="padding-top: 10px;">
        <div style="color: #555555; font-size: 13px;">
          ${socialHtml}
        </div>
      </td>
    </tr>
  `;
}

/**
 * Generate contact information section for universal signature
 */
function generateUniversalContactInfo(email, phone) {
  if (!email && !phone) return '';
  
  let contacts = [];
  
  if (email) {
    contacts.push(`✉ ${email}`);
  }
  
  if (phone) {
    contacts.push(`📱 ${phone}`);
  }
  
  if (contacts.length === 0) return '';
  
  return `
    <div class="signature-separator" style="background-color: #e0e0e0;"></div>
    <div class="signature-contact">
      ${contacts.join(' <span style="color: #999999;">•</span> ')}
    </div>
  `;
}

/**
 * Generate social links section for universal signature
 */
function generateUniversalSocialLinks(socialLinks) {
  if (!socialLinks || socialLinks.length === 0) return '';
  
  const enabledLinks = socialLinks.filter(link => link.enabled && link.url);
  
  if (enabledLinks.length === 0) return '';
  
  const socialHtml = enabledLinks.map(link => {
    const platform = link.platform.toLowerCase();
    const icon = getSocialIcon(platform);
    return `<span style="margin-right: 10px; color: #666;">${icon}</span>`;
  }).join('');
  
  return `
    <div class="signature-separator" style="background-color: #e0e0e0;"></div>
    <div class="signature-social">
      ${socialHtml}
    </div>
  `;
}

/**
 * Get appropriate icon for social media platform
 */
function getSocialIcon(platform) {
  const icons = {
    'linkedin': '💼',
    'twitter': '🐦',
    'x': '🐦',
    'facebook': '👍',
    'instagram': '📷',
    'tiktok': '🎵',
    'youtube': '📺',
    'github': '💻',
    'gitlab': '🍼',
    'behance': '🎨',
    'dribbble': '🏀',
    'medium': '📚',
    'dev.to': '🛠️',
    'discord': '🗨️',
    'telegram': '✈️',
    'whatsapp': '💬',
    'snapchat': '👻',
    'pinterest': '📌',
    'reddit': '🤣',
    'threads': '🧵',
    'twitch': '🎮',
    'stackoverflow': '☃️',
    'website': '🌐',
    'custom': '🔗'
  };
  
  return icons[platform] || icons['custom'] || '🔗';
}

/**
 * Validate email compatibility
 * Tests if HTML would work in major email clients
 */
export const validateEmailCompatibility = (html) => {
  const issues = [];
  const warnings = [];
  
  // Check for JavaScript
  if (html.includes('<script') || html.includes('javascript:')) {
    issues.push('Contains JavaScript which is not supported by most email clients');
  }
  
  // Check for complex CSS
  if (html.includes('expression(') || html.includes('behavior:')) {
    warnings.push('Contains IE-specific CSS properties that may not render');
  }
  
  // Check for unsupported elements
  if (html.includes('<video') || html.includes('<audio')) {
    warnings.push('Media elements may not play in all email clients');
  }
  
  // Check for inline styles (email-friendly)
  const styleCount = (html.match(/style=/g) || []).length;
  if (styleCount < 10) {
    warnings.push('Consider using more inline styles for better compatibility');
  }
  
  // Check for table layout (email-friendly)
  const tableCount = (html.match(/<table/g) || []).length;
  if (tableCount === 0) {
    warnings.push('Consider using table layout for better email client compatibility');
  }
  
  return {
    isCompatible: issues.length === 0,
    issues,
    warnings,
    score: Math.max(0, 100 - (issues.length * 20) - (warnings.length * 10))
  };
};

/**
 * Get email client specific recommendations
 */
export const getEmailClientRecommendations = () => {
  return {
    gmail: {
      best: ['Inline styles', 'Table layouts', 'Simple HTML', 'Alt text for images'],
      avoid: ['JavaScript', 'CSS animations', 'Complex selectors', 'External stylesheets'],
      limitations: ['Drops most CSS', 'Limited table support', 'Images can be blocked']
    },
    outlook: {
      best: ['Table layouts', 'Inline styles', 'Outlook-specific hacks', 'VML for shapes'],
      avoid: ['JavaScript', 'CSS3 properties', 'Media queries', 'Complex animations'],
      limitations: ['Older IE support', 'Complex layouts', 'CSS3 limitations']
    },
    apple_mail: {
      best: ['CSS3 properties', 'Modern HTML5', 'Inline styles', 'Web fonts'],
      avoid: ['JavaScript', 'Complex tables', 'Old HTML tags'],
      limitations: ['Some CSS3 support', 'JavaScript disabled']
    },
    yahoo: {
      best: ['Simple HTML', 'Inline styles', 'Table layouts'],
      avoid: ['JavaScript', 'Complex CSS', 'Media queries'],
      limitations: ['Limited CSS3 support', 'Older rendering engine']
    }
  };
};