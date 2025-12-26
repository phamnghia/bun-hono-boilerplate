/**
 * Input sanitization utilities to prevent XSS and injection attacks
 */

// RFC 5322 simplified email validation regex (extracted for reusability)
// Validates format: local-part@domain with proper character restrictions
const EMAIL_REGEX = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
const MAX_EMAIL_LENGTH = 254;

/**
 * Escape HTML special characters to prevent XSS
 * @param str - String to sanitize
 * @returns Sanitized string
 */
export function escapeHtml(str: string): string {
  const htmlEscapeMap: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };

  return str.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char] || char);
}

/**
 * Remove all HTML tags from a string
 * @param str - String to sanitize
 * @returns String without HTML tags
 */
export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "");
}

/**
 * Sanitize object by escaping all string values
 * @param obj - Object to sanitize
 * @param depth - Current recursion depth (for safety)
 * @param maxDepth - Maximum allowed recursion depth
 * @returns Sanitized object
 */
export function sanitizeObject<T extends Record<string, any>>(
  obj: T,
  depth: number = 0,
  maxDepth: number = 10
): T {
  if (depth > maxDepth) {
    throw new Error("Maximum recursion depth exceeded during sanitization");
  }

  const sanitized = {} as T;

  for (const key in obj) {
    const value = obj[key];
    
    if (typeof value === "string") {
      sanitized[key] = escapeHtml(value) as T[typeof key];
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value, depth + 1, maxDepth) as T[typeof key];
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item: unknown) =>
        typeof item === "string"
          ? escapeHtml(item)
          : typeof item === "object" && item !== null
          ? sanitizeObject(item as Record<string, any>, depth + 1, maxDepth)
          : item
      ) as T[typeof key];
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Validate and sanitize email address
 * @param email - Email to validate
 * @returns Sanitized email or null if invalid
 */
export function sanitizeEmail(email: string): string | null {
  const trimmed = email.trim().toLowerCase();
  
  if (!EMAIL_REGEX.test(trimmed) || trimmed.length > MAX_EMAIL_LENGTH) {
    return null;
  }
  
  return trimmed;
}

/**
 * Sanitize URL to prevent javascript: and data: URLs
 * @param url - URL to sanitize
 * @returns Sanitized URL or null if invalid
 */
export function sanitizeUrl(url: string): string | null {
  const trimmed = url.trim().toLowerCase();
  
  // Block dangerous protocols
  if (
    trimmed.startsWith("javascript:") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("vbscript:")
  ) {
    return null;
  }
  
  return url.trim();
}
