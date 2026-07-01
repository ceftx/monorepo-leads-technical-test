export abstract class DomainError extends Error {
    readonly name: string;
    readonly message: string;
    readonly code: string;
    readonly timestamp: Date;
    readonly metadata?: Record<string, any> | undefined;

    constructor(options: {
        message: string;
        code: string;
        metadata?: Record<string, any> | undefined;
    }) {
        super(options.message);
        this.name = this.constructor.name;
        this.message = options.message;
        this.code = options.code;
        this.timestamp = new Date();
        this.metadata = options.metadata;
        Error.captureStackTrace(this, this.constructor);
    }
}
