import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Order } from "./order.model";
import { CreateOrderDto, UpdateOrderDto } from "./orders.dto";

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order) private readonly orderModel: typeof Order,
    ) {}

    async create(dto: CreateOrderDto): Promise<Order> {
        return this.orderModel.create(dto);
    }

    async findAll(): Promise<Order[]> {
        return this.orderModel.findAll();
    }

    async findOne(id: string): Promise<Order | null> {
        return this.orderModel.findByPk(id);
    }

    async update(id: string, dto: UpdateOrderDto): Promise<Order> {
        const order = await this.findOne(id);
        if (!order) throw new NotFoundException("Order not found");
        return order.update(dto);
    }

    async delete(id: string): Promise<void> {
        const order = await this.findOne(id);
        if (order) await order.destroy();
    }

    async findByQuotation(quotationId: string): Promise<Order[]> {
        return this.orderModel.findAll({ where: { quotationId } });
    }
}
