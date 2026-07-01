import { describe, it, expect } from "vitest";
import { User } from "../../entities/User.js";
import { UserRole } from "../../value-objects/UserRole.js";
import { InvalidUserNameError } from "../../errors/UserErrors.js";

describe("User Entity", () => {
    describe("create", () => {
        it("should create a user with valid data", () => {
            const user = User.create({
                id: 1,
                email: "test@example.com",
                password: "hashed_password",
                nombre: "John Doe",
                rol: UserRole.VENDEDOR,
            });

            expect(user.id).toBe(1);
            expect(user.email.value).toBe("test@example.com");
            expect(user.password).toBe("hashed_password");
            expect(user.nombre).toBe("John Doe");
            expect(user.rol).toBe(UserRole.VENDEDOR);
        });

        it("should throw InvalidUserNameError for empty nombre", () => {
            expect(() =>
                User.create({
                    id: 1,
                    email: "test@example.com",
                    password: "hashed_password",
                    nombre: "",
                    rol: UserRole.VENDEDOR,
                }),
            ).toThrow(InvalidUserNameError);
        });

        it("should throw InvalidUserNameError for nombre with only whitespace", () => {
            expect(() =>
                User.create({
                    id: 1,
                    email: "test@example.com",
                    password: "hashed_password",
                    nombre: "   ",
                    rol: UserRole.VENDEDOR,
                }),
            ).toThrow(InvalidUserNameError);
        });

        it("should throw InvalidUserNameError for nombre exceeding 100 chars", () => {
            const longName = "a".repeat(101);
            expect(() =>
                User.create({
                    id: 1,
                    email: "test@example.com",
                    password: "hashed_password",
                    nombre: longName,
                    rol: UserRole.VENDEDOR,
                }),
            ).toThrow(InvalidUserNameError);
        });
    });

    describe("isAdmin", () => {
        it("should return true for ADMIN role", () => {
            const user = User.create({
                id: 1,
                email: "admin@example.com",
                password: "hashed_password",
                nombre: "Admin User",
                rol: UserRole.ADMIN,
            });

            expect(user.isAdmin()).toBe(true);
        });

        it("should return false for VENDEDOR role", () => {
            const user = User.create({
                id: 1,
                email: "vendedor@example.com",
                password: "hashed_password",
                nombre: "Vendedor User",
                rol: UserRole.VENDEDOR,
            });

            expect(user.isAdmin()).toBe(false);
        });
    });

    describe("canAccessLead", () => {
        it("should return true for admin accessing any lead", () => {
            const admin = User.create({
                id: 1,
                email: "admin@example.com",
                password: "hashed_password",
                nombre: "Admin User",
                rol: UserRole.ADMIN,
            });

            expect(admin.canAccessLead(999)).toBe(true);
        });

        it("should return true for vendedor accessing their own lead", () => {
            const vendedor = User.create({
                id: 2,
                email: "vendedor@example.com",
                password: "hashed_password",
                nombre: "Vendedor User",
                rol: UserRole.VENDEDOR,
            });

            expect(vendedor.canAccessLead(2)).toBe(true);
        });

        it("should return false for vendedor accessing another user's lead", () => {
            const vendedor = User.create({
                id: 2,
                email: "vendedor@example.com",
                password: "hashed_password",
                nombre: "Vendedor User",
                rol: UserRole.VENDEDOR,
            });

            expect(vendedor.canAccessLead(999)).toBe(false);
        });
    });

    describe("canManageUsers", () => {
        it("should return true for admin", () => {
            const admin = User.create({
                id: 1,
                email: "admin@example.com",
                password: "hashed_password",
                nombre: "Admin User",
                rol: UserRole.ADMIN,
            });

            expect(admin.canManageUsers()).toBe(true);
        });

        it("should return false for vendedor", () => {
            const vendedor = User.create({
                id: 2,
                email: "vendedor@example.com",
                password: "hashed_password",
                nombre: "Vendedor User",
                rol: UserRole.VENDEDOR,
            });

            expect(vendedor.canManageUsers()).toBe(false);
        });
    });
});
