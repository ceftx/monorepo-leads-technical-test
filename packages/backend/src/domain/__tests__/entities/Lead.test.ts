import { describe, it, expect } from "vitest";
import { Lead } from "../../entities/Lead.js";
import { LeadStatus } from "../../value-objects/LeadStatus.js";
import { InvalidLeadDataError } from "../../errors/LeadErrors.js";
import { InvalidEmailError } from "../../errors/AuthErrors.js";

describe("Lead Entity", () => {
    describe("create", () => {
        it("should create a lead with valid data", () => {
            const lead = Lead.create({
                id: 1,
                nombre: "John Doe",
                email: "john@company.com",
                empresa: "Tech Corp",
                montoEstimado: 50000,
                estado: LeadStatus.NUEVO,
                userId: 1,
            });

            expect(lead.id).toBe(1);
            expect(lead.nombre).toBe("John Doe");
            expect(lead.email.value).toBe("john@company.com");
            expect(lead.empresa).toBe("Tech Corp");
            expect(lead.montoEstimado).toBe(50000);
            expect(lead.estado).toBe(LeadStatus.NUEVO);
            expect(lead.userId).toBe(1);
        });

        it("should throw InvalidLeadDataError for empty nombre", () => {
            expect(() =>
                Lead.create({
                    id: 1,
                    nombre: "",
                    email: "john@company.com",
                    empresa: "Tech Corp",
                    montoEstimado: 50000,
                    estado: LeadStatus.NUEVO,
                    userId: 1,
                }),
            ).toThrow(InvalidLeadDataError);
        });

        it("should throw InvalidLeadDataError for nombre exceeding 100 chars", () => {
            const longName = "a".repeat(101);
            expect(() =>
                Lead.create({
                    id: 1,
                    nombre: longName,
                    email: "john@company.com",
                    empresa: "Tech Corp",
                    montoEstimado: 50000,
                    estado: LeadStatus.NUEVO,
                    userId: 1,
                }),
            ).toThrow(InvalidLeadDataError);
        });

        it("should throw InvalidLeadDataError for empty empresa", () => {
            expect(() =>
                Lead.create({
                    id: 1,
                    nombre: "John Doe",
                    email: "john@company.com",
                    empresa: "",
                    montoEstimado: 50000,
                    estado: LeadStatus.NUEVO,
                    userId: 1,
                }),
            ).toThrow(InvalidLeadDataError);
        });

        it("should throw InvalidLeadDataError for negative monto", () => {
            expect(() =>
                Lead.create({
                    id: 1,
                    nombre: "John Doe",
                    email: "john@company.com",
                    empresa: "Tech Corp",
                    montoEstimado: -1000,
                    estado: LeadStatus.NUEVO,
                    userId: 1,
                }),
            ).toThrow(InvalidLeadDataError);
        });

        it("should throw InvalidLeadDataError for monto exceeding max", () => {
            const maxMonto = 9999999999.99;
            expect(() =>
                Lead.create({
                    id: 1,
                    nombre: "John Doe",
                    email: "john@company.com",
                    empresa: "Tech Corp",
                    montoEstimado: maxMonto + 1,
                    estado: LeadStatus.NUEVO,
                    userId: 1,
                }),
            ).toThrow(InvalidLeadDataError);
        });

        it("should throw InvalidEmailError for invalid email", () => {
            expect(() =>
                Lead.create({
                    id: 1,
                    nombre: "John Doe",
                    email: "invalid-email",
                    empresa: "Tech Corp",
                    montoEstimado: 50000,
                    estado: LeadStatus.NUEVO,
                    userId: 1,
                }),
            ).toThrow(InvalidEmailError);
        });

        it("should throw InvalidLeadDataError for invalid userId", () => {
            expect(() =>
                Lead.create({
                    id: 1,
                    nombre: "John Doe",
                    email: "john@company.com",
                    empresa: "Tech Corp",
                    montoEstimado: 50000,
                    estado: LeadStatus.NUEVO,
                    userId: 0,
                }),
            ).toThrow(InvalidLeadDataError);
        });
    });

    describe("belongsToUser", () => {
        it("should return true when lead belongs to user", () => {
            const lead = Lead.create({
                id: 1,
                nombre: "John Doe",
                email: "john@company.com",
                empresa: "Tech Corp",
                montoEstimado: 50000,
                estado: LeadStatus.NUEVO,
                userId: 5,
            });

            expect(lead.belongsToUser(5)).toBe(true);
        });

        it("should return false when lead does not belong to user", () => {
            const lead = Lead.create({
                id: 1,
                nombre: "John Doe",
                email: "john@company.com",
                empresa: "Tech Corp",
                montoEstimado: 50000,
                estado: LeadStatus.NUEVO,
                userId: 5,
            });

            expect(lead.belongsToUser(10)).toBe(false);
        });
    });

    describe("isWon", () => {
        it("should return true for GANADO status", () => {
            const lead = Lead.create({
                id: 1,
                nombre: "John Doe",
                email: "john@company.com",
                empresa: "Tech Corp",
                montoEstimado: 50000,
                estado: LeadStatus.GANADO,
                userId: 1,
            });

            expect(lead.isWon()).toBe(true);
        });

        it("should return false for other statuses", () => {
            const lead = Lead.create({
                id: 1,
                nombre: "John Doe",
                email: "john@company.com",
                empresa: "Tech Corp",
                montoEstimado: 50000,
                estado: LeadStatus.NUEVO,
                userId: 1,
            });

            expect(lead.isWon()).toBe(false);
        });
    });

    describe("isLost", () => {
        it("should return true for PERDIDO status", () => {
            const lead = Lead.create({
                id: 1,
                nombre: "John Doe",
                email: "john@company.com",
                empresa: "Tech Corp",
                montoEstimado: 50000,
                estado: LeadStatus.PERDIDO,
                userId: 1,
            });

            expect(lead.isLost()).toBe(true);
        });

        it("should return false for other statuses", () => {
            const lead = Lead.create({
                id: 1,
                nombre: "John Doe",
                email: "john@company.com",
                empresa: "Tech Corp",
                montoEstimado: 50000,
                estado: LeadStatus.NUEVO,
                userId: 1,
            });

            expect(lead.isLost()).toBe(false);
        });
    });

    describe("isClosed", () => {
        it("should return true for GANADO status", () => {
            const leadGanado = Lead.create({
                id: 1,
                nombre: "John Doe",
                email: "john@company.com",
                empresa: "Tech Corp",
                montoEstimado: 50000,
                estado: LeadStatus.GANADO,
                userId: 1,
            });

            expect(leadGanado.isClosed()).toBe(true);
        });

        it("should return true for PERDIDO status", () => {
            const leadPerdido = Lead.create({
                id: 1,
                nombre: "John Doe",
                email: "john@company.com",
                empresa: "Tech Corp",
                montoEstimado: 50000,
                estado: LeadStatus.PERDIDO,
                userId: 1,
            });

            expect(leadPerdido.isClosed()).toBe(true);
        });

        it("should return false for open statuses", () => {
            const leadNuevo = Lead.create({
                id: 1,
                nombre: "John Doe",
                email: "john@company.com",
                empresa: "Tech Corp",
                montoEstimado: 50000,
                estado: LeadStatus.NUEVO,
                userId: 1,
            });

            expect(leadNuevo.isClosed()).toBe(false);
        });
    });
});
