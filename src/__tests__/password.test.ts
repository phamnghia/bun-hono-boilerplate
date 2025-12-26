import { describe, test, expect } from "bun:test";
import { hashPassword, verifyPassword } from "../utils/password";

describe("Password Utilities", () => {
  test("hashPassword should hash a password", async () => {
    const password = "testPassword123";
    const hash = await hashPassword(password);
    
    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(0);
  });

  test("verifyPassword should verify correct password", async () => {
    const password = "testPassword123";
    const hash = await hashPassword(password);
    
    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);
  });

  test("verifyPassword should reject incorrect password", async () => {
    const password = "testPassword123";
    const wrongPassword = "wrongPassword";
    const hash = await hashPassword(password);
    
    const isValid = await verifyPassword(wrongPassword, hash);
    expect(isValid).toBe(false);
  });
});
