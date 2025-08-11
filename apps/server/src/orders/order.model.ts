import {
    AllowNull,
    Column,
    DataType,
    Default,
    ForeignKey,
    HasMany,
    HasOne,
    Model,
    PrimaryKey,
    Table,
} from "sequelize-typescript";
import { Quotation } from "../quotations/quotation.model";

import { Contract } from "src/contracts/contract.model";

interface OrderAttributes {
    id: string;
    quotationId: string;
    deliveryAddress: string;
    endUserConfirmation: boolean;
    customerConfirmation: boolean;
    status: "pending" | "confirmed" | "cancelled";
    quotation?: Quotation[];
}

type OrderCreationAttributes = Omit<OrderAttributes, "id">;

@Table({ tableName: "orders", timestamps: true })
export class Order extends Model<OrderAttributes, OrderCreationAttributes> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

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

    @AllowNull(false)
    @Column(DataType.STRING)
    declare deliveryAddress: string;

    @AllowNull(false)
    @Column(DataType.ENUM("pending", "confirmed", "cancelled"))
    declare status: "pending" | "confirmed" | "cancelled";

    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    declare endUserConfirmation: boolean;

    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    declare customerConfirmation: boolean;
}
