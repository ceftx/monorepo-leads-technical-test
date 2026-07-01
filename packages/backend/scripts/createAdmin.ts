import { PrismaClient } from "../src/generated/prisma/index.js";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function createAdmin() {
    try {
        const hashedPassword = await bcrypt.hash("admin123", 10);

        const admin = await prisma.user.create({
            data: {
                email: "admin@leads.com",
                password: hashedPassword,
                nombre: "Admin User",
                rol: "ADMIN",
            },
        });

        console.log("✅ Admin user created successfully:");
        console.log("   Email: admin@leads.com");
        console.log("   Password: admin123");
        console.log("   Role: ADMIN");
        console.log("   ID:", admin.id);
    } catch (error: any) {
        console.error("❌ Error creating admin:", error.message);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
