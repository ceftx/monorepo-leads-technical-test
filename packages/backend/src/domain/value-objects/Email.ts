import { InvalidEmailError } from "../errors/AuthErrors.ts";

export class Email {
    private readonly _value: string;

    constructor(email: string) {
        const normalizedEmail = email.trim().toLowerCase();
        if (!this.isValidEmail(normalizedEmail)) {
            throw new InvalidEmailError(email);
        }
        this._value = normalizedEmail;
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return false;
        }
        if (email.length > 255) {
            return false;
        }
        return true;
    }

    get value(): string {
        return this._value;
    }
    equals(other: Email): boolean {
        return this._value === other._value;
    }
    toString(): string {
        return this._value;
    }
}
