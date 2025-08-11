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

const productCategory = [
    "Vehicles & Transportation",
    "Tools & Equipment",
    "Electronics & Gadgets",
    "Home Appliances",
    "Furniture",
    "Party & Event Supplies",
    "Clothing & Costumes",
    "Sports & Outdoor Gear",
    "Musical Instruments",
    "Cameras & Photography Gear",
    "Books & Media",
    "Real Estate & Spaces",
    "Art & Decor",
    "Health & Fitness Equipment",
    "Kids & Baby Items",
    "Gardening & Landscaping Tools",
    "Watercraft & Boats",
    "Luxury Items & Collectibles",
    "Pet Supplies",
    "Specialty & Niche Items",
];

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

    @Column(DataType.ENUM(...productCategory))
    declare category: string;

    @Column(DataType.TEXT)
    declare termsAndConditions: string;

    @Column(DataType.STRING)
    declare imageUrl: string;
}
