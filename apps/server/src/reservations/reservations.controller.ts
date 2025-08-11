import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from "@nestjs/common";
import { ReservationsService } from "./reservations.service";
import { CreateReservationDto, UpdateReservationDto } from "./reservations.dto";
import { Reservation } from "./reservation.model";

@Controller("reservations")
export class ReservationsController {
    constructor(private readonly reservationsService: ReservationsService) {}

    @Get()
    async findAll(): Promise<Reservation[]> {
        return this.reservationsService.findAll();
    }

    @Get(":id")
    async findOne(@Param("id") id: string): Promise<Reservation | null> {
        return this.reservationsService.findOne(id);
    }

    @Get("order/:orderId")
    async findByOrder(
        @Param("orderId") orderId: string,
    ): Promise<Reservation[]> {
        return this.reservationsService.findByOrder(orderId);
    }

    @Post()
    async create(@Body() dto: CreateReservationDto): Promise<Reservation> {
        return this.reservationsService.create(dto);
    }

    @Put(":id")
    async update(
        @Param("id") id: string,
        @Body() dto: UpdateReservationDto,
    ): Promise<Reservation> {
        return this.reservationsService.update(id, dto);
    }

    @Delete(":id")
    async delete(@Param("id") id: string): Promise<void> {
        return this.reservationsService.delete(id);
    }
}
