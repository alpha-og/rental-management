import { ReservationTable } from "./reservation.table";
import { Order } from "../orders/order.model";
import { Product } from "../products/products.model";
import {
    AllowNull,
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
} from "sequelize-typescript";

export class Reservation extends ReservationTable {
    @ForeignKey(() => Order)
    @AllowNull(false)
    @Column(DataType.UUID)
    declare orderId: string;

    @ForeignKey(() => Product)
    @AllowNull(false)
    @Column(DataType.UUID)
    declare productId: string;

    @BelongsTo(() => Order)
    declare order?: Order;

    @BelongsTo(() => Product, {
        as: "product",
        foreignKey: { name: "productId", allowNull: false },
        onDelete: "CASCADE",
    })
    declare product?: Product;
}
