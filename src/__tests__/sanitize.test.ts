import { describe, test, expect } from "bun:test";
import { escapeHtml, stripHtml, sanitizeEmail, sanitizeUrl } from "../utils/sanitize";

describe("Sanitization Utilities", () => {
  describe("escapeHtml", () => {
    test("should escape HTML special characters", () => {
      const input = '<script>alert("XSS")</script>';
      const expected = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;';
      expect(escapeHtml(input)).toBe(expected);
    });

    test("should escape ampersands", () => {
      expect(escapeHtml("Tom & Jerry")).toBe("Tom &amp; Jerry");
    });
  });

  describe("stripHtml", () => {
    test("should remove HTML tags", () => {
      const input = '<p>Hello <strong>World</strong></p>';
      const expected = 'Hello World';
      expect(stripHtml(input)).toBe(expected);
    });

    test("should handle self-closing tags", () => {
      const input = 'Line 1<br/>Line 2';
      const expected = 'Line 1Line 2';
      expect(stripHtml(input)).toBe(expected);
    });
  });

  describe("sanitizeEmail", () => {
    test("should accept valid email", () => {
      const email = "test@example.com";
      expect(sanitizeEmail(email)).toBe("test@example.com");
    });

    test("should trim and lowercase email", () => {
      const email = "  Test@Example.COM  ";
      expect(sanitizeEmail(email)).toBe("test@example.com");
    });

    test("should reject invalid email", () => {
      expect(sanitizeEmail("notanemail")).toBeNull();
      expect(sanitizeEmail("@example.com")).toBeNull();
      expect(sanitizeEmail("test@")).toBeNull();
    });
  });

  describe("sanitizeUrl", () => {
    test("should accept safe URLs", () => {
      const url = "https://example.com";
      expect(sanitizeUrl(url)).toBe(url);
    });

    test("should reject javascript: URLs", () => {
      expect(sanitizeUrl("javascript:alert(1)")).toBeNull();
      expect(sanitizeUrl("JAVASCRIPT:alert(1)")).toBeNull();
    });

    test("should reject data: URLs", () => {
      expect(sanitizeUrl("data:text/html,<script>alert(1)</script>")).toBeNull();
    });
  });
});
