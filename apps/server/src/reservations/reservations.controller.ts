import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    HttpStatus,
} from "@nestjs/common";
import { ReservationsService } from "./reservations.service";
import { CreateReservationDto, UpdateReservationDto } from "./reservations.dto";
import { Reservation } from "./reservation.model";
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiBearerAuth,
} from "@nestjs/swagger";

@ApiTags("reservations")
@ApiBearerAuth()
@Controller("reservations")
export class ReservationsController {
    constructor(private readonly reservationsService: ReservationsService) {}

    @Get()
    @ApiOperation({ summary: "Get all reservations" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Return all reservations.",
        type: [Reservation],
    })
    async findAll(): Promise<Reservation[]> {
        return this.reservationsService.findAll();
    }

    @Get(":id")
    @ApiOperation({ summary: "Get a reservation by id" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Return the reservation.",
        type: Reservation,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Reservation not found.",
    })
    async findOne(@Param("id") id: string): Promise<Reservation | null> {
        return this.reservationsService.findOne(id);
    }

    @Get("order/:orderId")
    @ApiOperation({ summary: "Get reservations by order id" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Return reservations by order id.",
        type: [Reservation],
    })
    async findByOrder(
        @Param("orderId") orderId: string,
    ): Promise<Reservation[]> {
        return this.reservationsService.findByOrder(orderId);
    }

    @Post()
    @ApiOperation({ summary: "Create a new reservation" })
    @ApiBody({ type: CreateReservationDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "The reservation has been successfully created.",
        type: Reservation,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Bad request.",
    })
    async create(@Body() dto: CreateReservationDto): Promise<Reservation> {
        return this.reservationsService.create(dto);
    }

    @Put(":id")
    @ApiOperation({ summary: "Update a reservation" })
    @ApiBody({ type: UpdateReservationDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "The reservation has been successfully updated.",
        type: Reservation,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Reservation not found.",
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Bad request.",
    })
    async update(
        @Param("id") id: string,
        @Body() dto: UpdateReservationDto,
    ): Promise<Reservation> {
        return this.reservationsService.update(id, dto);
    }

    @Delete(":id")
    @ApiOperation({ summary: "Delete a reservation" })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: "The reservation has been successfully deleted.",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Reservation not found.",
    })
    async delete(@Param("id") id: string): Promise<void> {
        return this.reservationsService.delete(id);
    }
}
