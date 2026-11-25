
import app from "./app";
import config from "./app/config";
import { transporter } from "./app/lib/nodemailer";
import { prisma } from "./app/lib/prisma";
import { redisClient } from "./app/lib/redis";
import {
    seedSuperAdmin,
    seedManagerAdmin,
    seedTesterTechnician,
} from "./app/utils/seed";

const PORT = Number(process.env.PORT) || Number(config.port) || 5000;

const main = async () => {
    try {
        await prisma.$connect();
        console.log("Connected to the database successfully.");

        await redisClient.connect();
        console.log("Redis Connected Successfully.");

        try {
            await transporter.verify();
            console.log("Nodemailer Connected Successfully.");
        } catch (error) {
            console.error("Nodemailer connection failed:", error);
        }

        await seedSuperAdmin();
        await seedManagerAdmin();
        await seedTesterTechnician();

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Error starting the server:", error);

        await prisma.$disconnect();
        process.exit(1);
    }
};

main();
