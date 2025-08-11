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
import { Order } from "../orders/order.model";
import { Product } from "../products/products.model";

interface ReservationAttributes {
    id: string;
    orderId: string;
    isValid: boolean;
}

type ReservationCreationAttributes = Omit<ReservationAttributes, "id">;

@Table({ tableName: "reservations", timestamps: true })
export class Reservation extends Model<
    ReservationAttributes,
    ReservationCreationAttributes
> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

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

    // @BelongsTo(() => Product, {
    //     as: "product",
    //     foreignKey: { name: "productId", allowNull: false },
    //     onDelete: "CASCADE",
    // })
    // declare product?: Product;

    @AllowNull(false)
    @Default(true)
    @Column(DataType.BOOLEAN)
    declare isValid: boolean;
}
