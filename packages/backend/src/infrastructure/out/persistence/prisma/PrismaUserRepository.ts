import { PrismaClient } from "../../../../generated/prisma/index.js";
import type { IUserRepository } from "../../../../domain/repositories/IUserRepository.js";
import { User } from "../../../../domain/entities/User.js";
import { UserRole } from "../../../../domain/value-objects/UserRole.js";

export class PrismaUserRepository implements IUserRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async findById(id: number): Promise<User | null> {
        const userPrisma = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!userPrisma) {
            return null;
        }

        return this.toDomain(userPrisma);
    }

    async findByEmail(email: string): Promise<User | null> {
        const userPrisma = await this.prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (!userPrisma) {
            return null;
        }

        return this.toDomain(userPrisma);
    }

    async findByRole(rol: UserRole): Promise<User[]> {
        const usersPrisma = await this.prisma.user.findMany({
            where: { rol },
        });

        return usersPrisma.map((user) => this.toDomain(user));
    }

    async findAll(): Promise<User[]> {
        const usersPrisma = await this.prisma.user.findMany({
            orderBy: { createdAt: "desc" },
        });

        return usersPrisma.map((user) => this.toDomain(user));
    }

    async create(user: User): Promise<User> {
        const userPrisma = await this.prisma.user.create({
            data: {
                email: user.email.value,
                password: user.password,
                nombre: user.nombre,
                rol: user.rol,
            },
        });

        return this.toDomain(userPrisma);
    }

    async update(user: User): Promise<User> {
        const userPrisma = await this.prisma.user.update({
            where: { id: user.id },
            data: {
                email: user.email.value,
                password: user.password,
                nombre: user.nombre,
                rol: user.rol,
            },
        });

        return this.toDomain(userPrisma);
    }

    async delete(id: number): Promise<void> {
        await this.prisma.user.delete({
            where: { id },
        });
    }

    async countAll(): Promise<number> {
        return await this.prisma.user.count();
    }

    /**
     * Mapea un modelo de Prisma a una entidad de Domain
     */
    private toDomain(userPrisma: any): User {
        return User.create({
            id: userPrisma.id,
            email: userPrisma.email,
            password: userPrisma.password,
            nombre: userPrisma.nombre,
            rol: userPrisma.rol as UserRole,
            createdAt: userPrisma.createdAt,
            updatedAt: userPrisma.updatedAt,
        });
    }
}
