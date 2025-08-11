import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

const PORT = process.env.PORT ?? 4000;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Define api route prefix
    app.setGlobalPrefix("api/v1");

    // Enable CORS
    app.enableCors({
        // temporarily hardcoded origins
        origin: ["http://localhost:3000", "http:35.222.216.48"],
    });

    // Enable cookie parser
    app.use(cookieParser());

    // Enable validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        }),
    );

    // Swagger API Documentation
    const config = new DocumentBuilder()
        .setTitle("Rental Management API")
        .setDescription("API for rental management")
        .setVersion("0.1")
        .addTag("rental")
        .addCookieAuth("refreshToken")
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, documentFactory);

    await app.listen(PORT);
}

bootstrap()
    .then(() => console.log(`Server is running on ${PORT}`))
    .catch((error: unknown) => {
        console.error("Bootstrap error:", error);
        process.exit(1);
    });
