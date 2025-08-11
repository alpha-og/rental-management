import {
    AllowNull,
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    Default,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
} from "sequelize-typescript";
import { Product } from "../products/products.model";
import { Quotation } from "src/quotations/quotation.model";

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

    @ForeignKey(() => Product)
    @AllowNull(false)
    @Column(DataType.UUID)
    declare productId: string;

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

    @BelongsTo(() => Product)
    declare product: Product;

    @BelongsToMany(() => Quotation, { through: "quotationRates" })
    declare quotations: Quotation[];
}
