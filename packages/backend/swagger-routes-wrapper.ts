import { Router } from "express";

// Importar las rutas originales
import authRoutes from "./src/infrastructure/in/http/express/routes/auth.routes.ts";
import leadsRoutes from "./src/infrastructure/in/http/express/routes/leads.routes.ts";
import usersRoutes from "./src/infrastructure/in/http/express/routes/users.routes.ts";
import dashboardRoutes from "./src/infrastructure/in/http/express/routes/dashboard.routes.ts";

/**
 * Este archivo existe SOLO para la generación del swagger
 * Monta todas las rutas con sus prefijos correctos para que swagger-autogen
 * genere los paths completos (ej: /api/leads en vez de /)
 */
const router = Router();

// Montar todas las rutas con sus prefijos (igual que en Server.ts)
router.use("/api/auth", authRoutes);
router.use("/api/leads", leadsRoutes);
router.use("/api/users", usersRoutes);
router.use("/api/dashboard", dashboardRoutes);

export default router;
