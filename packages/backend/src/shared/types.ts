import type { User } from "../domain/entities/User.js";

/**
 * Extiende el tipo Request de Express para incluir el usuario autenticado
 */
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export {};
