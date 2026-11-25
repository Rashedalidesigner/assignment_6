
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
        console.log("Connecting to Database...");

        await prisma.$connect();
        console.log("Connected to the database successfully.");

        console.log("Connecting to Redis...");

        await redisClient.connect();
        console.log("Redis Connected Successfully.");

        // Start HTTP server immediately after essential connections
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server is running on port ${PORT}`);
        });

        // Run optional startup tasks without blocking HTTP server
        void (async () => {
            try {
                await transporter.verify();
                console.log("Nodemailer Connected Successfully.");
            } catch (error) {
                console.error("Nodemailer verification failed:", error);
            }

            try {
                await seedSuperAdmin();
                console.log("Super Admin seed completed.");

                await seedManagerAdmin();
                console.log("Manager Admin seed completed.");

                await seedTesterTechnician();
                console.log("Tester Technician seed completed.");
            } catch (error) {
                console.error("Database seeding failed:", error);
            }
        })();

    } catch (error) {
        console.error("Error starting the server:", error);

        await prisma.$disconnect();
        process.exit(1);
    }
};

main();
