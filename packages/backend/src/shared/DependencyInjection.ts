import { PrismaClient } from "../generated/prisma/index.js";
import { PrismaUserRepository } from "../infrastructure/out/persistence/prisma/PrismaUserRepository.js";
import { PrismaLeadRepository } from "../infrastructure/out/persistence/prisma/PrismaLeadRepository.js";
import { BcryptService } from "../infrastructure/out/auth/BcryptService.js";
import { JwtService } from "../infrastructure/out/auth/JwtService.js";
import { RegisterUser } from "../application/use-cases/auth/RegisterUser.js";
import { LoginUser } from "../application/use-cases/auth/LoginUser.js";
import { CreateLead } from "../application/use-cases/leads/CreateLead.js";
import { GetLeadsByUser } from "../application/use-cases/leads/GetLeadsByUser.js";
import { UpdateLeadStatus } from "../application/use-cases/leads/UpdateLeadStatus.js";
import { DeleteLead } from "../application/use-cases/leads/DeleteLead.js";
import { GetUserMetrics } from "../application/use-cases/dashboard/GetUserMetrics.js";
import { GetGlobalMetrics } from "../application/use-cases/dashboard/GetGlobalMetrics.js";
import type { IUserRepository } from "../domain/repositories/IUserRepository.js";
import type { ILeadRepository } from "../domain/repositories/ILeadRepository.js";

/**
 * Contenedor de Inyección de Dependencias (DI Container)
 *
 * Responsabilidades:
 * - Instanciar todas las dependencias de la aplicación
 * - Inyectar dependencias en casos de uso
 * - Proveer acceso centralizado a servicios y repositorios
 */
export class DependencyContainer {
    // === Infrastructure ===
    private readonly prisma: PrismaClient;

    // === Repositories ===
    private readonly userRepository: IUserRepository;
    private readonly leadRepository: ILeadRepository;

    // === Services ===
    private readonly bcryptService: BcryptService;
    private readonly jwtService: JwtService;

    // === Use Cases - Auth ===
    private readonly registerUserUseCase: RegisterUser;
    private readonly loginUserUseCase: LoginUser;

    // === Use Cases - Leads ===
    private readonly createLeadUseCase: CreateLead;
    private readonly getLeadsByUserUseCase: GetLeadsByUser;
    private readonly updateLeadStatusUseCase: UpdateLeadStatus;
    private readonly deleteLeadUseCase: DeleteLead;

    // === Use Cases - Dashboard ===
    private readonly getUserMetricsUseCase: GetUserMetrics;
    private readonly getGlobalMetricsUseCase: GetGlobalMetrics;

    constructor() {
        // 1. Instanciar Infrastructure
        this.prisma = new PrismaClient();

        // 2. Instanciar Repositories
        this.userRepository = new PrismaUserRepository(this.prisma);
        this.leadRepository = new PrismaLeadRepository(this.prisma);

        // 3. Instanciar Services
        this.bcryptService = new BcryptService();
        this.jwtService = new JwtService(
            process.env.JWT_SECRET || "super-secret-key-change-in-production",
            "7d",
        );

        // 4. Instanciar Use Cases - Auth
        this.registerUserUseCase = new RegisterUser(
            this.userRepository,
            this.bcryptService,
        );

        this.loginUserUseCase = new LoginUser(
            this.userRepository,
            this.bcryptService,
            this.jwtService,
        );

        // 5. Instanciar Use Cases - Leads
        this.createLeadUseCase = new CreateLead(
            this.leadRepository,
            this.userRepository,
        );

        this.getLeadsByUserUseCase = new GetLeadsByUser(this.leadRepository);

        this.updateLeadStatusUseCase = new UpdateLeadStatus(
            this.leadRepository,
        );

        this.deleteLeadUseCase = new DeleteLead(this.leadRepository);

        // 6. Instanciar Use Cases - Dashboard
        this.getUserMetricsUseCase = new GetUserMetrics(
            this.leadRepository,
            this.userRepository,
        );

        this.getGlobalMetricsUseCase = new GetGlobalMetrics(
            this.leadRepository,
            this.userRepository,
        );
    }

    // === Getters - Infrastructure ===
    getPrisma(): PrismaClient {
        return this.prisma;
    }

    // === Getters - Repositories ===
    getUserRepository(): IUserRepository {
        return this.userRepository;
    }

    getLeadRepository(): ILeadRepository {
        return this.leadRepository;
    }

    // === Getters - Services ===
    getBcryptService(): BcryptService {
        return this.bcryptService;
    }

    getJwtService(): JwtService {
        return this.jwtService;
    }

    // === Getters - Use Cases: Auth ===
    getRegisterUserUseCase(): RegisterUser {
        return this.registerUserUseCase;
    }

    getLoginUserUseCase(): LoginUser {
        return this.loginUserUseCase;
    }

    // === Getters - Use Cases: Leads ===
    getCreateLeadUseCase(): CreateLead {
        return this.createLeadUseCase;
    }

    getGetLeadsByUserUseCase(): GetLeadsByUser {
        return this.getLeadsByUserUseCase;
    }

    getUpdateLeadStatusUseCase(): UpdateLeadStatus {
        return this.updateLeadStatusUseCase;
    }

    getDeleteLeadUseCase(): DeleteLead {
        return this.deleteLeadUseCase;
    }

    // === Getters - Use Cases: Dashboard ===
    getGetUserMetricsUseCase(): GetUserMetrics {
        return this.getUserMetricsUseCase;
    }

    getGetGlobalMetricsUseCase(): GetGlobalMetrics {
        return this.getGlobalMetricsUseCase;
    }

    // === Cleanup ===
    async disconnect(): Promise<void> {
        await this.prisma.$disconnect();
    }
}

// Singleton instance
export const container = new DependencyContainer();
