import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Order } from "./order.model";
import { CreateOrderDto, UpdateOrderDto } from "./orders.dto";
import { Quotation } from "../quotations/quotation.model";
import { Product } from "../products/products.model";

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order) private readonly orderModel: typeof Order,
        @InjectModel(Quotation)
        private readonly quotationModel: typeof Quotation,
        @InjectModel(Product) private readonly productModel: typeof Product,
    ) {}

    async create(dto: CreateOrderDto): Promise<Order> {
        // Start a transaction to avoid race conditions on stock update
        const sequelize = this.orderModel.sequelize;
        if (!sequelize) throw new Error("Sequelize instance not available");
        const transaction = await sequelize.transaction();
        try {
            // Load quotation (must contain productId & quantity)
            const quotation = await this.quotationModel.findByPk(
                dto.quotationId,
                { transaction },
            );
            if (!quotation) {
                throw new NotFoundException("Quotation not found");
            }
            // Fetch product with row-level lock
            const product = await this.productModel.findByPk(
                quotation.productId,
                {
                    transaction,
                    lock: transaction.LOCK.UPDATE,
                },
            );
            if (!product) throw new NotFoundException("Product not found");

            // Ensure enough stock
            if (product.quantity < quotation.quantity) {
                throw new BadRequestException("Insufficient product quantity");
            }

            // Decrement stock
            product.quantity -= quotation.quantity;
            await product.save({ transaction });

            // Create order
            const order = await this.orderModel.create(
                {
                    ...dto,
                },
                { transaction },
            );

            await transaction.commit();
            return order;
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
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
