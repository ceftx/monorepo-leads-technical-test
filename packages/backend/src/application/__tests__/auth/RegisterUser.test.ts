import { describe, it, expect, beforeEach } from "vitest";
import { RegisterUser } from "../../use-cases/auth/RegisterUser.js";
import { MockUserRepository } from "../mocks/MockUserRepository.js";
import { MockBcryptService } from "../mocks/MockBcryptService.js";
import { UserRole } from "../../../domain/value-objects/UserRole.js";
import { User } from "../../../domain/entities/User.js";

describe("RegisterUser Use Case", () => {
    let userRepository: MockUserRepository;
    let bcryptService: MockBcryptService;
    let registerUser: RegisterUser;

    beforeEach(() => {
        userRepository = new MockUserRepository();
        bcryptService = new MockBcryptService();
        registerUser = new RegisterUser(userRepository, bcryptService);
    });

    it("should register a new user successfully", async () => {
        const result = await registerUser.execute({
            email: "newuser@example.com",
            password: "password123",
            nombre: "New User",
            rol: UserRole.VENDEDOR,
        });

        expect(result.id).toBeDefined();
        expect(result.email.value).toBe("newuser@example.com");
        expect(result.nombre).toBe("New User");
        expect(result.rol).toBe(UserRole.VENDEDOR);
        // Password should be hashed
        expect(result.password).not.toBe("password123");
    });

    it("should throw error for duplicate email", async () => {
        // Create existing user
        const existingUser = User.create({
            id: 1,
            email: "existing@example.com",
            password: "hashedpass",
            nombre: "Existing User",
            rol: UserRole.VENDEDOR,
        });
        userRepository.addUser(existingUser);

        await expect(
            registerUser.execute({
                email: "existing@example.com",
                password: "password123",
                nombre: "Another User",
                rol: UserRole.VENDEDOR,
            }),
        ).rejects.toThrow("ya está registrado");
    });

    it("should hash the password before saving", async () => {
        const plainPassword = "mySecurePassword123";

        const result = await registerUser.execute({
            email: "user@example.com",
            password: plainPassword,
            nombre: "Test User",
            rol: UserRole.VENDEDOR,
        });

        // Password should be hashed (bcrypt hash starts with $2b$)
        expect(result.password).toMatch(/^\$2[aby]\$/);
        expect(result.password).not.toBe(plainPassword);
    });

    it("should validate email format", async () => {
        await expect(
            registerUser.execute({
                email: "invalid-email",
                password: "password123",
                nombre: "Test User",
                rol: UserRole.VENDEDOR,
            }),
        ).rejects.toThrow();
    });

    it("should validate nombre is not empty", async () => {
        await expect(
            registerUser.execute({
                email: "user@example.com",
                password: "password123",
                nombre: "",
                rol: UserRole.VENDEDOR,
            }),
        ).rejects.toThrow();
    });
});
