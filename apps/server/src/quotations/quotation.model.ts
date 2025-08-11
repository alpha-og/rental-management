import {
    AllowNull,
    Column,
    DataType,
    Default,
    Model,
    PrimaryKey,
    Table,
} from "sequelize-typescript";

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

    @AllowNull(false)
    @Column(DataType.INTEGER)
    declare quantity: number;

    @Column(DataType.UUID)
    declare productId: string;

    @Column(DataType.UUID)
    declare rateId: string;
}
