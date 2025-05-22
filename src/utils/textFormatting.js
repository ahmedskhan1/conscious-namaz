'use client';

/**
 * Converts HTML content to plain text
 * @param {string} html - HTML string to convert
 * @returns {string} Plain text with newlines preserved
 */
export const htmlToPlainText = (html) => {
  if (!html) return '';
  
  // Client-side only code
  if (typeof window !== 'undefined') {
    // Create a DOM element to work with the HTML
    const doc = new DOMParser().parseFromString(html, 'text/html');
    
    // Extract text content with preserved formatting
    return doc.body.textContent || '';
  }
  
  // Simple server-side fallback
  return html.replace(/<[^>]*>/g, '');
};

/**
 * Converts plain text to simple HTML with preserved line breaks
 * @param {string} text - Plain text to convert
 * @returns {string} HTML with paragraphs and line breaks
 */
export const plainTextToHtml = (text) => {
  if (!text) return '';
  
  // Replace newlines with paragraph tags
  return '<p>' + 
    text
      .replace(/\n{2,}/g, '</p><p>') // Double newlines become new paragraphs
      .replace(/\n/g, '<br>') + // Single newlines become <br>
    '</p>';
};

/**
 * Checks if a string contains HTML tags
 * @param {string} text - Text to check
 * @returns {boolean} True if the text contains HTML
 */
export const containsHtml = (text) => {
  if (!text) return false;
  
  const htmlRegex = /<\/?[a-z][\s\S]*>/i;
  return htmlRegex.test(text);
};

/**
 * Strips HTML tags from content for plain text display
 * @param {string} html - HTML string to strip tags from
 * @param {number} maxLength - Maximum length of the returned string
 * @returns {string} Plain text with tags removed
 */
export const stripHtmlTags = (html, maxLength = 0) => {
  if (!html) return '';
  
  // Remove HTML tags and normalize whitespace
  const plainText = html
    .replace(/<\/?[^>]+(>|$)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  
  // Return the full text or a truncated version
  if (maxLength > 0 && plainText.length > maxLength) {
    return plainText.substring(0, maxLength) + "...";
  }
  
  return plainText;
}; 