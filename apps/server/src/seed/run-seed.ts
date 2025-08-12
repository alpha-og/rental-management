import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { runSeeder } from "./seed";

async function bootstrap() {
    console.log("🚀 Initializing NestJS application for seeding...");

    // Create the NestJS application context
    const app = await NestFactory.createApplicationContext(AppModule);

    try {
        // Run the seeder
        await runSeeder();

        console.log("✅ Seeding process completed successfully!");
    } catch (error) {
        console.error("❌ Seeding process failed:", error);
        process.exit(1);
    } finally {
        // Close the application context
        await app.close();
    }
}

// Run the bootstrap function
bootstrap()
    .then(() => {
        console.log("Seeding process finished.");
    })
    .catch((error) => {
        console.error("Error occurred during seeding:", error);
    });
