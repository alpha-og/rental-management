import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto, UpdateOrderDto } from "./orders.dto";
import { Order } from "./order.model";

@Controller("orders")
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Get()
    async findAll(): Promise<Order[]> {
        return this.ordersService.findAll();
    }

    @Get(":id")
    async findOne(@Param("id") id: string): Promise<Order | null> {
        return this.ordersService.findOne(id);
    }

    @Get("quotation/:quotationId")
    async findByQuotation(
        @Param("quotationId") quotationId: string,
    ): Promise<Order[]> {
        return this.ordersService.findByQuotation(quotationId);
    }

    @Post()
    async create(@Body() dto: CreateOrderDto): Promise<Order> {
        return this.ordersService.create(dto);
    }

    @Put(":id")
    async update(
        @Param("id") id: string,
        @Body() dto: UpdateOrderDto,
    ): Promise<Order> {
        return this.ordersService.update(id, dto);
    }

    @Delete(":id")
    async delete(@Param("id") id: string): Promise<void> {
        return this.ordersService.delete(id);
    }
}
