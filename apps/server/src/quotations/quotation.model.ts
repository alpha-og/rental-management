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
import { Product } from "../products/products.model";
import { Rate } from "../rates/rate.model";

interface QuotationAttributes {
    id: string;
    productId: string;
    rateId: string;
    quantity: number;
}

type QuotationCreationAttributes = Omit<QuotationAttributes, "id">;

@Table({ tableName: "quotations", timestamps: true })
export class Quotation extends Model<
    QuotationAttributes,
    QuotationCreationAttributes
> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @ForeignKey(() => Product)
    @AllowNull(false)
    @Column(DataType.UUID)
    declare productId: string;

    //   @BelongsTo(() => Product)
    // declare product?: Product;

    // @ForeignKey(() => Rate)
    @AllowNull(false)
    @Column(DataType.UUID)
    declare rateId: string;

    @BelongsTo(() => Rate)
    declare rate?: Rate;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    declare quantity: number;
}
