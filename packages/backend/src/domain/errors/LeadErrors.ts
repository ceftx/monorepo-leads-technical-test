import { DomainError } from "./DomainError.ts";

export class InvalidLeadDataError extends DomainError {
    constructor(field: string, reason: string, value?: any) {
        super({
            code: "INVALID_LEAD_DATA",
            message: `${field}: ${reason}`,
            metadata: { field, value },
        });
    }
}
