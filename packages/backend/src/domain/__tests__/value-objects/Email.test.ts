import { describe, it, expect } from "vitest";
import { Email } from "../../value-objects/Email.js";
import { InvalidEmailError } from "../../errors/AuthErrors.js";

describe("Email Value Object", () => {
    describe("constructor", () => {
        it("should create a valid email", () => {
            const email = new Email("test@example.com");
            expect(email.value).toBe("test@example.com");
        });

        it("should normalize email to lowercase", () => {
            const email = new Email("TEST@EXAMPLE.COM");
            expect(email.value).toBe("test@example.com");
        });

        it("should trim whitespace", () => {
            const email = new Email("  test@example.com  ");
            expect(email.value).toBe("test@example.com");
        });

        it("should throw InvalidEmailError for empty string", () => {
            expect(() => new Email("")).toThrow(InvalidEmailError);
        });

        it("should throw InvalidEmailError for invalid format", () => {
            expect(() => new Email("invalid-email")).toThrow(InvalidEmailError);
            expect(() => new Email("@example.com")).toThrow(InvalidEmailError);
            expect(() => new Email("test@")).toThrow(InvalidEmailError);
            expect(() => new Email("test@@example.com")).toThrow(
                InvalidEmailError,
            );
        });

        it("should accept valid email formats", () => {
            expect(() => new Email("simple@example.com")).not.toThrow();
            expect(() => new Email("user.name@example.com")).not.toThrow();
            expect(() => new Email("user+tag@example.co.uk")).not.toThrow();
            expect(
                () => new Email("user_name@example-domain.com"),
            ).not.toThrow();
        });
    });

    describe("equals", () => {
        it("should return true for equal emails", () => {
            const email1 = new Email("test@example.com");
            const email2 = new Email("TEST@EXAMPLE.COM");
            expect(email1.equals(email2)).toBe(true);
        });

        it("should return false for different emails", () => {
            const email1 = new Email("test1@example.com");
            const email2 = new Email("test2@example.com");
            expect(email1.equals(email2)).toBe(false);
        });
    });
});
