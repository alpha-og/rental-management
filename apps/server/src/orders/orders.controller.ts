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
import { OrdersService } from "./orders.service";
import { CreateOrderDto, UpdateOrderDto } from "./orders.dto";
import { Order } from "./order.model";
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiBearerAuth,
} from "@nestjs/swagger";

@ApiTags("orders")
@ApiBearerAuth()
@Controller("orders")
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Get()
    @ApiOperation({ summary: "Get all orders" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Return all orders.",
        type: [Order],
    })
    async findAll(): Promise<Order[]> {
        return this.ordersService.findAll();
    }

    @Get(":id")
    @ApiOperation({ summary: "Get an order by id" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Return the order.",
        type: Order,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Order not found.",
    })
    async findOne(@Param("id") id: string): Promise<Order | null> {
        return this.ordersService.findOne(id);
    }

    @Get("quotation/:quotationId")
    @ApiOperation({ summary: "Get orders by quotation id" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Return orders by quotation id.",
        type: [Order],
    })
    async findByQuotation(
        @Param("quotationId") quotationId: string,
    ): Promise<Order[]> {
        return this.ordersService.findByQuotation(quotationId);
    }

    @Post()
    @ApiOperation({ summary: "Create a new order" })
    @ApiBody({ type: CreateOrderDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "The order has been successfully created.",
        type: Order,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Bad request.",
    })
    async create(@Body() dto: CreateOrderDto): Promise<Order> {
        return this.ordersService.create(dto);
    }

    @Put(":id")
    @ApiOperation({ summary: "Update an order" })
    @ApiBody({ type: UpdateOrderDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "The order has been successfully updated.",
        type: Order,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Order not found.",
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Bad request.",
    })
    async update(
        @Param("id") id: string,
        @Body() dto: UpdateOrderDto,
    ): Promise<Order> {
        return this.ordersService.update(id, dto);
    }

    @Delete(":id")
    @ApiOperation({ summary: "Delete an order" })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: "The order has been successfully deleted.",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Order not found.",
    })
    async delete(@Param("id") id: string): Promise<void> {
        return this.ordersService.delete(id);
    }
}
