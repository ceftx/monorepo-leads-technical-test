import { describe, it, expect } from "vitest";
import { UserRole, isValidUserRole } from "../../value-objects/UserRole.js";

describe("UserRole Enum", () => {
    describe("enum values", () => {
        it("should have ADMIN value", () => {
            expect(UserRole.ADMIN).toBe("ADMIN");
        });

        it("should have VENDEDOR value", () => {
            expect(UserRole.VENDEDOR).toBe("VENDEDOR");
        });
    });

    describe("isValidUserRole", () => {
        it("should return true for ADMIN", () => {
            expect(isValidUserRole("ADMIN")).toBe(true);
        });

        it("should return true for VENDEDOR", () => {
            expect(isValidUserRole("VENDEDOR")).toBe(true);
        });

        it("should return false for invalid role", () => {
            expect(isValidUserRole("INVALID")).toBe(false);
            expect(isValidUserRole("admin")).toBe(false);
            expect(isValidUserRole("")).toBe(false);
            expect(isValidUserRole("MANAGER")).toBe(false);
        });
    });
});
