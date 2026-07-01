import type { IUserRepository } from "../../../domain/repositories/IUserRepository.ts";
import type {
    JwtService,
    JwtPayload,
} from "../../../infrastructure/out/auth/JwtService.ts";

export interface RefreshTokenResponse {
    token: string;
    user: {
        id: number;
        email: string;
        nombre: string;
        rol: string;
    };
}

export class RefreshToken {
    constructor(
        private userRepository: IUserRepository,
        private jwtService: JwtService,
    ) {}

    async execute(token: string): Promise<RefreshTokenResponse> {
        // 1. Verificar y decodificar el token actual
        const payload = this.jwtService.verify(token);

        // 2. Buscar el usuario para obtener datos actualizados
        const user = await this.userRepository.findById(payload.userId);

        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        // 3. Generar nuevo token
        const newToken = this.jwtService.generate({
            userId: user.id,
            email: user.email.value,
            rol: user.rol,
        });

        // 4. Retornar nuevo token y datos del usuario
        return {
            token: newToken,
            user: {
                id: user.id,
                email: user.email.value,
                nombre: user.nombre,
                rol: user.rol,
            },
        };
    }
}
