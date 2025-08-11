import { Injectable } from "@nestjs/common";
import { Product } from "../products/products.model";
import { Rate } from "../rates/rate.model";
import { Quotation } from "../quotations/quotation.model";
import { Order } from "../orders/order.model";
import { Contract } from "../contracts/contract.model";
import { Reservation } from "../reservations/reservation.model";
import { Attachment } from "../attachments/attachment.model";

// Call this AFTER SequelizeModule initialized (e.g. in a provider onModuleInit)
export function applyAssociations(): void {
    // Product 1─* Rate
    Product.hasMany(Rate, {
        foreignKey: "productId",
        as: "rates",
        onDelete: "CASCADE",
    });
    Rate.belongsTo(Product, { foreignKey: "productId", as: "product" });

    // Product 1─* Attachment
    Product.hasMany(Attachment, {
        foreignKey: "productId",
        as: "attachments",
        onDelete: "CASCADE",
    });
    Attachment.belongsTo(Product, { foreignKey: "productId", as: "product" });

    // Product 1─* Reservation
    Product.hasMany(Reservation, {
        foreignKey: "productId",
        as: "reservations",
        onDelete: "CASCADE",
    });
    Reservation.belongsTo(Product, { foreignKey: "productId", as: "product" });

    // Product 1─* Quotation (if quotations reference productId)
    Product.hasMany(Quotation, {
        foreignKey: "productId",
        as: "quotations",
        onDelete: "CASCADE",
    });
    Quotation.belongsTo(Product, { foreignKey: "productId", as: "product" });

    // Rate 1─* Quotation (if quotations have rateId)
    Quotation.hasOne(Rate, {
        foreignKey: "rateId",
        as: "quotations",
        onDelete: "CASCADE",
    });
    Rate.belongsTo(Quotation, { foreignKey: "rateId", as: "rate" });

    // Quotation 1─1 Order (if order has quotationId)
    Order.hasOne(Quotation, {
        foreignKey: "orderId",
        as: "order",
        onDelete: "CASCADE",
    });
    Quotation.belongsTo(Order, { foreignKey: "orderId", as: "quotation" });

    // Order 1─* Reservation (if reservation has orderId)
    Order.hasMany(Reservation, {
        foreignKey: "orderId",
        as: "reservations",
        onDelete: "CASCADE",
    });
    Reservation.belongsTo(Order, { foreignKey: "orderId", as: "order" });

    // Quotation 1─1 Contract (if contract has quotationId)
    Quotation.hasOne(Contract, {
        foreignKey: "quotationId",
        as: "contract",
        onDelete: "CASCADE",
    });
    Contract.belongsTo(Order, {
        foreignKey: "quotationId",
        as: "quotation",
    });

    // Order 1─1 Contract (if contract also needs orderId)
    // Uncomment only if contract has orderId column:
    // Order.hasOne(Contract, { foreignKey: "orderId", as: "contract", onDelete: "CASCADE" });
    // Contract.belongsTo(Order, { foreignKey: "orderId", as: "order" });

    // If you still truly need Product↔Quotation many-to-many:
    // Product.belongsToMany(Quotation, { through: "productQuotation", as: "m2mQuotations", foreignKey: "productId" });
    // Quotation.belongsToMany(Product, { through: "productQuotation", as: "products", foreignKey: "quotationId" });
    // Remove the direct hasMany in that case to avoid confusion.
}

@Injectable()
export class AssociationsService {}
