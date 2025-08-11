import { OrderTable } from "./order.table";
import { Quotation } from "../quotations/quotation.model";
import { Contract } from "../contracts/contract.model";
import {
    AllowNull,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    HasOne,
} from "sequelize-typescript";

export class Order extends OrderTable {
    @ForeignKey(() => Quotation)
    @AllowNull(false)
    @Column(DataType.UUID)
    declare quotationId: string;

    @HasMany(() => Quotation, {
        foreignKey: { name: "orderId", allowNull: false },
        onDelete: "CASCADE",
    })
    declare quotation: Quotation[];

    @HasOne(() => Contract, {
        as: "contract",
        foreignKey: { name: "quotationId", allowNull: false },
        onDelete: "CASCADE",
    })
    declare contract?: Contract;
}
