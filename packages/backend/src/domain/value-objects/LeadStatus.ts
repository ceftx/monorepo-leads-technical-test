export enum LeadStatus {
    NUEVO = "NUEVO",
    CONTACTADO = "CONTACTADO",
    GANADO = "GANADO",
    PERDIDO = "PERDIDO",
}

export class LeadStatusTransitions {
    private static readonly allowedTransitions: Record<
        LeadStatus,
        LeadStatus[]
    > = {
        [LeadStatus.NUEVO]: [LeadStatus.CONTACTADO, LeadStatus.PERDIDO],
        [LeadStatus.CONTACTADO]: [LeadStatus.GANADO, LeadStatus.PERDIDO],
        [LeadStatus.GANADO]: [], // Estado final
        [LeadStatus.PERDIDO]: [], // Estado final
    };
    static canTransition(from: LeadStatus, to: LeadStatus): boolean {
        return this.allowedTransitions[from].includes(to);
    }
}
