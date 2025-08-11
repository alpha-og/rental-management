import {
    AllowNull,
    BelongsTo,
    Column,
    DataType,
    Default,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
} from "sequelize-typescript";
import { Quotation } from "../quotations/quotation.model";
import { Order } from "src/orders/order.model";

interface ContractAttributes {
    id: string;
    orderId: string;
    rentalPeriod: string; // ISO 8601 duration or custom format
    startDate: Date;
}

type ContractCreationAttributes = Omit<ContractAttributes, "id">;

@Table({ tableName: "contracts", timestamps: true })
export class Contract extends Model<
    ContractAttributes,
    ContractCreationAttributes
> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @ForeignKey(() => Quotation)
    @AllowNull(false)
    @Column(DataType.UUID)
    declare quotationId: string;

    @BelongsTo(() => Order, {
        as: "order",
        foreignKey: { name: "orderId", allowNull: false },
        onDelete: "CASCADE",
    })
    @AllowNull(false)
    @Column(DataType.STRING)
    declare rentalPeriod: string;

    @AllowNull(false)
    @Column(DataType.DATE)
    declare startDate: Date;
}
