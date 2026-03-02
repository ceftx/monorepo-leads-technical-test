import { Email } from "../value-objects/Email.ts";
import { LeadStatus } from "../value-objects/LeadStatus.ts";
import { InvalidLeadDataError } from "../errors/LeadErrors.ts";

export class Lead {
    private constructor(
        public readonly id: number,
        public readonly nombre: string,
        public readonly email: Email,
        public readonly empresa: string,
        public readonly montoEstimado: number,
        public readonly estado: LeadStatus,
        public readonly userId: number,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) {}

    static create(props: {
        id: number;
        nombre: string;
        email: string;
        empresa: string;
        montoEstimado: number;
        estado: LeadStatus;
        userId: number;
        createdAt?: Date;
        updatedAt?: Date;
    }): Lead {
        // 1. Validar y crear Email Value Object
        const emailVO = new Email(props.email);

        // 2. Validar nombre
        const trimmedNombre = props.nombre.trim();

        if (trimmedNombre.length === 0) {
            throw new InvalidLeadDataError(
                "nombre",
                "El nombre no puede estar vacío",
                props.nombre,
            );
        }

        if (trimmedNombre.length > 100) {
            throw new InvalidLeadDataError(
                "nombre",
                "El nombre no puede exceder 100 caracteres",
                props.nombre,
            );
        }

        // 3. Validar empresa
        const trimmedEmpresa = props.empresa.trim();

        if (trimmedEmpresa.length === 0) {
            throw new InvalidLeadDataError(
                "empresa",
                "La empresa no puede estar vacía",
                props.empresa,
            );
        }

        if (trimmedEmpresa.length > 200) {
            throw new InvalidLeadDataError(
                "empresa",
                "La empresa no puede exceder 200 caracteres",
                props.empresa,
            );
        }

        // 4. Validar monto estimado
        if (props.montoEstimado < 0) {
            throw new InvalidLeadDataError(
                "montoEstimado",
                "El monto estimado no puede ser negativo",
                props.montoEstimado,
            );
        }

        // Validar monto máximo según Prisma Decimal(12, 2)
        if (props.montoEstimado > 9999999999.99) {
            throw new InvalidLeadDataError(
                "montoEstimado",
                "El monto estimado excede el máximo permitido",
                props.montoEstimado,
            );
        }

        // 5. Validar userId
        if (props.userId <= 0) {
            throw new InvalidLeadDataError(
                "userId",
                "El userId debe ser mayor a 0",
                props.userId,
            );
        }

        // 6. Crear la instancia
        return new Lead(
            props.id,
            trimmedNombre,
            emailVO,
            trimmedEmpresa,
            props.montoEstimado,
            props.estado,
            props.userId,
            props.createdAt ?? new Date(),
            props.updatedAt ?? new Date(),
        );
    }

    // Métodos de negocio
    belongsToUser(userId: number): boolean {
        return this.userId === userId;
    }

    isWon(): boolean {
        return this.estado === LeadStatus.GANADO;
    }

    isLost(): boolean {
        return this.estado === LeadStatus.PERDIDO;
    }

    isClosed(): boolean {
        return this.isWon() || this.isLost();
    }
}
