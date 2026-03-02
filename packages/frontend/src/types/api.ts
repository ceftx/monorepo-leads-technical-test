import { User } from './user';
import { Lead, LeadStatus } from './lead';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserMetrics {
  userId: number;
  nombreUsuario: string;
  totalLeads: number;
  distribucionPorEstado: {
    estado: LeadStatus;
    cantidad: number;
  }[];
  montoEstimadoTotal: number;
  leadsUltimos7Dias: number;
  leadsRecientes: Lead[];
}

export interface GlobalMetrics extends UserMetrics {
  totalUsuarios: number;
  rankingVendedores: {
    userId: number;
    nombreVendedor: string;
    montoGanado: number;
    leadsGanados: number;
  }[];
}
