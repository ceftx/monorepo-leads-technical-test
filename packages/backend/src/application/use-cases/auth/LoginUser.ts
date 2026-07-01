import type { IUserRepository } from "../../../domain/repositories/IUserRepository.ts";
import { InvalidCredentialsError } from "../../../domain/errors/AuthErrors.ts";
import type { BcryptService } from "../../../infrastructure/out/auth/BcryptService.ts";
import type { JwtService } from "../../../infrastructure/out/auth/JwtService.ts";

export interface LoginUserDTO {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: number;
        email: string;
        nombre: string;
        rol: string;
    };
}

export class LoginUser {
    constructor(
        private userRepository: IUserRepository,
        private bcryptService: BcryptService,
        private jwtService: JwtService,
    ) {}

    async execute(data: LoginUserDTO): Promise<LoginResponse> {
        // 1. Buscar usuario por email
        const user = await this.userRepository.findByEmail(data.email);
        if (!user) {
            throw new InvalidCredentialsError();
        }

        // 2. Verificar password
        const isValidPassword = await this.bcryptService.compare(
            data.password,
            user.password,
        );

        if (!isValidPassword) {
            throw new InvalidCredentialsError();
        }

        // 3. Generar JWT
        const token = this.jwtService.generate({
            userId: user.id,
            email: user.email.value,
            rol: user.rol,
        });

        // 4. Retornar respuesta (NO incluir password)
        return {
            token,
            user: {
                id: user.id,
                email: user.email.value,
                nombre: user.nombre,
                rol: user.rol,
            },
        };
    }
}
