export enum LeadStatus {
  NUEVO = 'NUEVO',
  CONTACTADO = 'CONTACTADO',
  GANADO = 'GANADO',
  PERDIDO = 'PERDIDO'
}

export interface Lead {
  id: number;
  nombre: string;
  email: string;
  empresa: string;
  montoEstimado: number;
  estado: LeadStatus;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadDto {
  nombre: string;
  email: string;
  empresa: string;
  montoEstimado: number;
}

export interface UpdateLeadDto {
  nombre: string;
  email: string;
  empresa: string;
  montoEstimado: number;
}

export interface UpdateLeadStatusDto {
  estado: LeadStatus;
}
