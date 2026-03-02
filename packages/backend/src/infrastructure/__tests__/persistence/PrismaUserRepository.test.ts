import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { PrismaClient } from "../../../generated/prisma/index.js";
import { PrismaUserRepository } from "../../out/persistence/prisma/PrismaUserRepository.js";
import { User } from "../../../domain/entities/User.js";
import { UserRole } from "../../../domain/value-objects/UserRole.js";

const prisma = new PrismaClient();
const userRepository = new PrismaUserRepository(prisma);

describe("PrismaUserRepository Integration Tests", () => {
    // Clean up before each test
    beforeEach(async () => {
        await prisma.lead.deleteMany();
        await prisma.user.deleteMany();
    });

    // Clean up and disconnect after all tests
    afterAll(async () => {
        await prisma.lead.deleteMany();
        await prisma.user.deleteMany();
        await prisma.$disconnect();
    });

    describe("create", () => {
        it("should create a user in the database", async () => {
            const user = User.create({
                id: 1,
                email: "test@example.com",
                password: "hashed_password",
                nombre: "Test User",
                rol: UserRole.VENDEDOR,
            });

            const savedUser = await userRepository.create(user);

            expect(savedUser.id).toBeDefined();
            expect(savedUser.email.value).toBe("test@example.com");
            expect(savedUser.nombre).toBe("Test User");
            expect(savedUser.rol).toBe(UserRole.VENDEDOR);
        });
    });

    describe("findByEmail", () => {
        it("should find a user by email", async () => {
            const user = User.create({
                id: 1,
                email: "findme@example.com",
                password: "hashed_password",
                nombre: "Find Me",
                rol: UserRole.VENDEDOR,
            });

            await userRepository.create(user);

            const foundUser =
                await userRepository.findByEmail("findme@example.com");

            expect(foundUser).not.toBeNull();
            expect(foundUser?.email.value).toBe("findme@example.com");
            expect(foundUser?.nombre).toBe("Find Me");
        });

        it("should return null for non-existent email", async () => {
            const foundUser = await userRepository.findByEmail(
                "nonexistent@example.com",
            );

            expect(foundUser).toBeNull();
        });
    });

    describe("findById", () => {
        it("should find a user by id", async () => {
            const user = User.create({
                id: 1,
                email: "findbyid@example.com",
                password: "hashed_password",
                nombre: "Find By ID",
                rol: UserRole.ADMIN,
            });

            const savedUser = await userRepository.create(user);
            const foundUser = await userRepository.findById(savedUser.id);

            expect(foundUser).not.toBeNull();
            expect(foundUser?.id).toBe(savedUser.id);
            expect(foundUser?.email.value).toBe("findbyid@example.com");
        });
    });

    describe("findByRole", () => {
        it("should find all users with a specific role", async () => {
            await userRepository.create(
                User.create({
                    id: 1,
                    email: "admin1@example.com",
                    password: "hash",
                    nombre: "Admin 1",
                    rol: UserRole.ADMIN,
                }),
            );

            await userRepository.create(
                User.create({
                    id: 2,
                    email: "admin2@example.com",
                    password: "hash",
                    nombre: "Admin 2",
                    rol: UserRole.ADMIN,
                }),
            );

            await userRepository.create(
                User.create({
                    id: 3,
                    email: "vendedor@example.com",
                    password: "hash",
                    nombre: "Vendedor",
                    rol: UserRole.VENDEDOR,
                }),
            );

            const admins = await userRepository.findByRole(UserRole.ADMIN);

            expect(admins).toHaveLength(2);
            expect(admins.every((u) => u.rol === UserRole.ADMIN)).toBe(true);
        });
    });

    describe("delete", () => {
        it("should delete a user from the database", async () => {
            const user = User.create({
                id: 1,
                email: "delete@example.com",
                password: "hash",
                nombre: "Delete Me",
                rol: UserRole.VENDEDOR,
            });

            const savedUser = await userRepository.create(user);
            await userRepository.delete(savedUser.id);

            const foundUser = await userRepository.findById(savedUser.id);
            expect(foundUser).toBeNull();
        });
    });

    describe("countAll", () => {
        it("should return the total number of users", async () => {
            await userRepository.create(
                User.create({
                    id: 1,
                    email: "user1@example.com",
                    password: "hash",
                    nombre: "User 1",
                    rol: UserRole.VENDEDOR,
                }),
            );

            await userRepository.create(
                User.create({
                    id: 2,
                    email: "user2@example.com",
                    password: "hash",
                    nombre: "User 2",
                    rol: UserRole.ADMIN,
                }),
            );

            const count = await userRepository.countAll();
            expect(count).toBe(2);
        });
    });
});
