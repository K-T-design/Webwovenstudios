export const $ = (selector) => document.querySelector(selector);
export const $$ = (selector) => document.querySelectorAll(selector);

export const createEl = (tag, attributes = {}, children = []) => {
  const el = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      el.className = value;
    } else if (key === 'dataset') {
      Object.entries(value).forEach(([dataKey, dataVal]) => {
        el.dataset[dataKey] = dataVal;
      });
    } else {
      el.setAttribute(key, value);
    }
  });
  
  children.forEach(child => {
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else {
      el.appendChild(child);
    }
  });
  
  return el;
};

export const sanitizeHTML = (str) => {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
};

/**
 * Sanitize a URL for safe use in href/src attributes.
 * Only allows http(s), mailto, tel, and data:image schemes.
 * Returns an empty string for anything unsafe (e.g. javascript:).
 */
export const sanitizeURL = (url) => {
  if (typeof url !== 'string' || url.trim() === '') return '';
  const trimmed = url.trim();

  // Allow safe schemes
  if (/^(https?:|mailto:|tel:|data:image\/)/i.test(trimmed)) {
    return trimmed;
  }

  // Allow relative URLs starting with "/" or "./" or "../"
  if (/^(\/|\.\/|\.\.\/)/.test(trimmed)) {
    return trimmed;
  }

  // Block everything else (javascript:, vbscript:, file:, etc.)
  return '';
};

/**
 * Validate and sanitize an image URL specifically.
 * Permits http(s) and data:image URLs only.
 */
export const sanitizeImageURL = (url) => {
  if (typeof url !== 'string' || url.trim() === '') return '';
  const trimmed = url.trim();
  if (/^(https?:|data:image\/)/i.test(trimmed)) {
    return trimmed;
  }
  return '';
};
