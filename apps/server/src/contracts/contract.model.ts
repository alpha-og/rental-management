import { ContractTable } from "./contract.table";
import { Quotation } from "../quotations/quotation.model";
import { Order } from "../orders/order.model";
import {
    AllowNull,
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
} from "sequelize-typescript";

export class Contract extends ContractTable {
    @ForeignKey(() => Quotation)
    @AllowNull(false)
    @Column(DataType.UUID)
    declare quotationId: string;

    @BelongsTo(() => Quotation)
    declare quotation: Quotation;

    @ForeignKey(() => Order)
    @AllowNull(false)
    @Column(DataType.UUID)
    declare orderId: string;

    @BelongsTo(() => Order, {
        as: "order",
        foreignKey: { name: "orderId", allowNull: false },
        onDelete: "CASCADE",
    })
    declare order: Order;
}
