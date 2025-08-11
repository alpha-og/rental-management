import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/user/user.module";
import { AuthGuard } from "./auth.guard";

@Module({
    imports: [
        // Minimal JWT module; secrets & expirations provided at sign() time in AuthService
        JwtModule.register({}),
        UserModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, AuthGuard],
    exports: [AuthService, AuthGuard, JwtModule],
})
export class AuthModule {}
