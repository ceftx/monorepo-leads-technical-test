import type { IUserRepository } from "../../../domain/repositories/IUserRepository.js";
import { User } from "../../../domain/entities/User.js";
import { UserRole } from "../../../domain/value-objects/UserRole.js";

export class MockUserRepository implements IUserRepository {
    private users: User[] = [];

    async findById(id: number): Promise<User | null> {
        return this.users.find((u) => u.id === id) || null;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.users.find((u) => u.email.value === email) || null;
    }

    async create(user: User): Promise<User> {
        this.users.push(user);
        return user;
    }

    async update(user: User): Promise<User> {
        const index = this.users.findIndex((u) => u.id === user.id);
        if (index !== -1) {
            this.users[index] = user;
        }
        return user;
    }

    async findAll(): Promise<User[]> {
        return this.users;
    }

    async delete(id: number): Promise<void> {
        this.users = this.users.filter((u) => u.id !== id);
    }

    async findByRole(rol: UserRole): Promise<User[]> {
        return this.users.filter((u) => u.rol === rol);
    }

    async countAll(): Promise<number> {
        return this.users.length;
    }

    // Helper methods for testing
    addUser(user: User): void {
        this.users.push(user);
    }

    clear(): void {
        this.users = [];
    }
}
