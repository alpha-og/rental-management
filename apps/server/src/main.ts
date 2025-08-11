import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";

const PORT = process.env.PORT ?? 4000;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        }),
    );
    await app.listen(PORT);
}

bootstrap()
    .then(() => console.log(`Server is running on ${PORT}`))
    .catch((error: unknown) => {
        console.error("Bootstrap error:", error);
        process.exit(1);
    });
