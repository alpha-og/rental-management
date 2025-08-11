import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Reservation } from "./reservation.model";
import { CreateReservationDto, UpdateReservationDto } from "./reservations.dto";

@Injectable()
export class ReservationsService {
    constructor(
        @InjectModel(Reservation)
        private readonly reservationModel: typeof Reservation,
    ) {}

    async create(dto: CreateReservationDto): Promise<Reservation> {
        return this.reservationModel.create(dto);
    }

    async findAll(): Promise<Reservation[]> {
        return this.reservationModel.findAll();
    }

    async findOne(id: string): Promise<Reservation | null> {
        return this.reservationModel.findByPk(id);
    }

    async update(id: string, dto: UpdateReservationDto): Promise<Reservation> {
        const reservation = await this.findOne(id);
        if (!reservation) throw new NotFoundException("Reservation not found");
        return reservation.update(dto);
    }

    async delete(id: string): Promise<void> {
        const reservation = await this.findOne(id);
        if (reservation) await reservation.destroy();
    }

    async findByOrder(orderId: string): Promise<Reservation[]> {
        return this.reservationModel.findAll({ where: { orderId } });
    }
}
