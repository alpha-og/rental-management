import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Order } from "../orders/order.model";
import { Quotation } from "../quotations/quotation.model";
import { Product } from "../products/products.model";
import { User } from "../user/user.model";
import { Sequelize } from "sequelize-typescript";

@Injectable()
export class DashboardService {
    constructor(
        @InjectModel(Order) private orderModel: typeof Order,
        @InjectModel(Quotation) private quotationModel: typeof Quotation,
        @InjectModel(Product) private productModel: typeof Product,
        @InjectModel(User) private userModel: typeof User,
        private sequelize: Sequelize,
    ) {}

    async getStats() {
        // Count quotations
        const quotations = await this.quotationModel.count();
        // Count orders
        const rentals = await this.orderModel.count();
        // Calculate revenue by summing product prices for each order's quotation
        const orders = await this.orderModel.findAll({
            include: [
                {
                    model: Quotation,
                    include: [Product],
                },
            ],
        });

        let revenue = 0;
        for (const order of orders) {
            const quotation = order.get("Quotation") as Quotation;
            const product = quotation?.get("Product") as Product;
            if (quotation && product) {
                revenue += (product.price || 0) * (quotation.quantity || 1);
            }
        }
        return { quotations, rentals, revenue };
    }

    async getTopProductCategories() {
        // Example: group orders by product category
        return this.productModel.findAll({
            attributes: [
                "category",
                [
                    this.sequelize.fn("COUNT", this.sequelize.col("id")),
                    "ordered",
                ],
                [
                    this.sequelize.fn("SUM", this.sequelize.col("price")),
                    "revenue",
                ],
            ],
            group: ["category"],
            order: [
                [this.sequelize.fn("SUM", this.sequelize.col("price")), "DESC"],
            ],
            limit: 5,
        });
    }

    async getTopProducts() {
        // Example: group orders by product
        return this.orderModel.findAll({
            attributes: [
                "productId",
                [
                    this.sequelize.fn("COUNT", this.sequelize.col("id")),
                    "ordered",
                ],
                [
                    this.sequelize.fn("SUM", this.sequelize.col("price")),
                    "revenue",
                ],
            ],
            group: ["productId"],
            order: [
                [this.sequelize.fn("SUM", this.sequelize.col("price")), "DESC"],
            ],
            limit: 5,
            include: [{ model: Product, attributes: ["name"] }],
        });
    }

    async getTopCustomers() {
        // Example: group orders by user
        return this.orderModel.findAll({
            attributes: [
                "userId",
                [
                    this.sequelize.fn("COUNT", this.sequelize.col("id")),
                    "ordered",
                ],
                [
                    this.sequelize.fn("SUM", this.sequelize.col("price")),
                    "revenue",
                ],
            ],
            group: ["userId"],
            order: [
                [this.sequelize.fn("SUM", this.sequelize.col("price")), "DESC"],
            ],
            limit: 5,
            include: [{ model: User, attributes: ["name"] }],
        });
    }
}
