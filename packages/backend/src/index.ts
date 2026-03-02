import { Server } from "./infrastructure/in/http/express/Server.js";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

const PORT = parseInt(process.env.PORT || "3000", 10);

// Crear e iniciar el servidor
const server = new Server(PORT);
server.start();
