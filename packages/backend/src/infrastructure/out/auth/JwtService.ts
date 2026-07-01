import jwt from "jsonwebtoken";

export interface JwtPayload {
    userId: number;
    email: string;
    rol: string;
}

export class JwtService {
    private readonly secret: string;
    private readonly expiresIn: string;

    constructor(secret: string, expiresIn: string = "7d") {
        this.secret = secret;
        this.expiresIn = expiresIn;
    }

    generate(payload: JwtPayload): string {
        return jwt.sign(payload, this.secret, {
            expiresIn: this.expiresIn as any,
        });
    }

    verify(token: string): JwtPayload {
        return jwt.verify(token, this.secret) as JwtPayload;
    }
}
