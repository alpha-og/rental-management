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
export class QuotationTable extends Model<
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
}
