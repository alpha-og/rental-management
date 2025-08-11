import {
    AllowNull,
    Column,
    DataType,
    Default,
    Model,
    PrimaryKey,
    Table,
} from "sequelize-typescript";

export enum RateDuration {
    HOURLY = "HOURLY",
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY",
}

interface RateAttributes {
    id: string;
    productId: string;
    duration: RateDuration;
    price: number;
    isExtra: boolean;
}

type RateCreationAttributes = Omit<RateAttributes, "id">;

@Table({ tableName: "rates", timestamps: true })
export class Rate extends Model<RateAttributes, RateCreationAttributes> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @AllowNull(false)
    @Column(DataType.ENUM(...Object.values(RateDuration)))
    declare duration: RateDuration;

    @AllowNull(false)
    @Column(DataType.FLOAT)
    declare price: number;

    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    declare isExtra: boolean;

    @Column(DataType.UUID)
    declare productId: string;
}
