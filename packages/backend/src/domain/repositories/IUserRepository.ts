import { User } from "../entities/User.ts";
import { UserRole } from "../value-objects/UserRole.ts";

export interface IUserRepository {
    // Búsquedas
    findById(id: number): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByRole(rol: UserRole): Promise<User[]>;
    findAll(): Promise<User[]>;

    // Escritura
    create(user: User): Promise<User>;
    update(user: User): Promise<User>;
    delete(id: number): Promise<void>;

    // Métricas
    countAll(): Promise<number>;
}
