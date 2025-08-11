import {
    Column,
    Model,
    PrimaryKey,
    Table,
    DataType,
    Default,
    AllowNull,
} from "sequelize-typescript";

interface ProductAttributes {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
}
// Add creation interface (excludes auto-generated fields)
type ProductCreationAttributes = Omit<ProductAttributes, "id">;

@Table({
    tableName: "products", //  Explicit table name
    timestamps: true, //  Adds createdAt/updatedAt
})
export class Product extends Model<
    ProductAttributes,
    ProductCreationAttributes
> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID) //  Simplified - no redundant options
    declare id: string;

    @AllowNull(false)
    @Column
    declare name: string;

    @Column
    declare description?: string;

    @AllowNull(false)
    @Column(DataType.FLOAT)
    declare price: number;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    declare quantity: number;

    @Column(DataType.ENUM())
    declare category: string;

    @Column(DataType.TEXT)
    declare termsAndConditions: string;

    @Column(DataType.STRING)
    declare imageUrl: string;
}
