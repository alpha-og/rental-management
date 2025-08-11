import {
    AllowNull,
    Column,
    DataType,
    Default,
    Model,
    PrimaryKey,
    Table,
} from "sequelize-typescript";

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

    @AllowNull(false)
    @Default(true)
    @Column(DataType.BOOLEAN)
    declare isValid: boolean;

    @Column(DataType.UUID)
    declare productId: string;
}
