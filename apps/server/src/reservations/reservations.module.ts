import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Reservation } from "./reservation.model";
import { ReservationsService } from "./reservations.service";
import { ReservationsController } from "./reservations.controller";

@Module({
    imports: [SequelizeModule.forFeature([Reservation])],
    providers: [ReservationsService],
    controllers: [ReservationsController],
    exports: [ReservationsService],
})
export class ReservationsModule {}
