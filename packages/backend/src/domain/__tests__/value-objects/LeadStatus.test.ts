import { describe, it, expect } from "vitest";
import {
    LeadStatus,
    LeadStatusTransitions,
} from "../../value-objects/LeadStatus.js";

describe("LeadStatus", () => {
    describe("enum values", () => {
        it("should have NUEVO value", () => {
            expect(LeadStatus.NUEVO).toBe("NUEVO");
        });

        it("should have CONTACTADO value", () => {
            expect(LeadStatus.CONTACTADO).toBe("CONTACTADO");
        });

        it("should have GANADO value", () => {
            expect(LeadStatus.GANADO).toBe("GANADO");
        });

        it("should have PERDIDO value", () => {
            expect(LeadStatus.PERDIDO).toBe("PERDIDO");
        });
    });

    describe("LeadStatusTransitions", () => {
        describe("canTransition", () => {
            it("should allow NUEVO -> CONTACTADO", () => {
                expect(
                    LeadStatusTransitions.canTransition(
                        LeadStatus.NUEVO,
                        LeadStatus.CONTACTADO,
                    ),
                ).toBe(true);
            });

            it("should allow NUEVO -> PERDIDO", () => {
                expect(
                    LeadStatusTransitions.canTransition(
                        LeadStatus.NUEVO,
                        LeadStatus.PERDIDO,
                    ),
                ).toBe(true);
            });

            it("should allow CONTACTADO -> GANADO", () => {
                expect(
                    LeadStatusTransitions.canTransition(
                        LeadStatus.CONTACTADO,
                        LeadStatus.GANADO,
                    ),
                ).toBe(true);
            });

            it("should allow CONTACTADO -> PERDIDO", () => {
                expect(
                    LeadStatusTransitions.canTransition(
                        LeadStatus.CONTACTADO,
                        LeadStatus.PERDIDO,
                    ),
                ).toBe(true);
            });

            it("should not allow NUEVO -> GANADO", () => {
                expect(
                    LeadStatusTransitions.canTransition(
                        LeadStatus.NUEVO,
                        LeadStatus.GANADO,
                    ),
                ).toBe(false);
            });

            it("should not allow transitions from GANADO", () => {
                expect(
                    LeadStatusTransitions.canTransition(
                        LeadStatus.GANADO,
                        LeadStatus.PERDIDO,
                    ),
                ).toBe(false);
                expect(
                    LeadStatusTransitions.canTransition(
                        LeadStatus.GANADO,
                        LeadStatus.CONTACTADO,
                    ),
                ).toBe(false);
            });

            it("should not allow transitions from PERDIDO", () => {
                expect(
                    LeadStatusTransitions.canTransition(
                        LeadStatus.PERDIDO,
                        LeadStatus.GANADO,
                    ),
                ).toBe(false);
                expect(
                    LeadStatusTransitions.canTransition(
                        LeadStatus.PERDIDO,
                        LeadStatus.CONTACTADO,
                    ),
                ).toBe(false);
            });
        });
    });
});
