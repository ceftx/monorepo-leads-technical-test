import { describe, it, expect, beforeEach } from "vitest";
import { LoginUser } from "../../use-cases/auth/LoginUser.js";
import { MockUserRepository } from "../mocks/MockUserRepository.js";
import { MockBcryptService } from "../mocks/MockBcryptService.js";
import { User } from "../../../domain/entities/User.js";
import { UserRole } from "../../../domain/value-objects/UserRole.js";

// Mock JWT Service
class MockJwtService {
    generate(payload: any): string {
        return `mock_jwt_token_${payload.userId}`;
    }

    verify(token: string): any {
        return { userId: 1 };
    }
}

describe("LoginUser Use Case", () => {
    let userRepository: MockUserRepository;
    let bcryptService: MockBcryptService;
    let jwtService: MockJwtService;
    let loginUser: LoginUser;

    beforeEach(() => {
        userRepository = new MockUserRepository();
        bcryptService = new MockBcryptService();
        jwtService = new MockJwtService();
        loginUser = new LoginUser(userRepository, bcryptService, jwtService);
    });

    it("should login successfully with valid credentials", async () => {
        // Setup: Create a user with hashed password
        const password = "password123";
        const hashedPassword = await bcryptService.hash(password);

        const user = User.create({
            id: 1,
            email: "user@example.com",
            password: hashedPassword,
            nombre: "Test User",
            rol: UserRole.VENDEDOR,
        });
        userRepository.addUser(user);

        // Execute
        const result = await loginUser.execute({
            email: "user@example.com",
            password: password,
        });

        // Assert
        expect(result.user.id).toBe(1);
        expect(result.user.email).toBe("user@example.com");
        expect(result.token).toBe("mock_jwt_token_1");
    });

    it("should throw error for non-existent user", async () => {
        await expect(
            loginUser.execute({
                email: "nonexistent@example.com",
                password: "password123",
            }),
        ).rejects.toThrow();
    });

    it("should throw error for incorrect password", async () => {
        const hashedPassword = await bcryptService.hash("correctpassword");

        const user = User.create({
            id: 1,
            email: "user@example.com",
            password: hashedPassword,
            nombre: "Test User",
            rol: UserRole.VENDEDOR,
        });
        userRepository.addUser(user);

        await expect(
            loginUser.execute({
                email: "user@example.com",
                password: "wrongpassword",
            }),
        ).rejects.toThrow();
    });
});
