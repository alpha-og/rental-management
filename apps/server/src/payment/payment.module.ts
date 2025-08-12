import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [ConfigModule, JwtModule],
    controllers: [PaymentController],
    providers: [PaymentService],
    exports: [PaymentService],
})
export class PaymentModule {}
