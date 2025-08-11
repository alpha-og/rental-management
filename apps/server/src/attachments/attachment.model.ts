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

interface AttachmentAttributes {
    id: string;
    productId: string;
    url: string;
    mimeType?: string;
}

type AttachmentCreationAttributes = Omit<AttachmentAttributes, "id">;

@Table({ tableName: "attachments", timestamps: true })
export class Attachment extends Model<
    AttachmentAttributes,
    AttachmentCreationAttributes
> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @ForeignKey(() => Product)
    @AllowNull(false)
    @Column(DataType.UUID)
    declare productId: string;

    @BelongsTo(() => Product)
    declare product?: Product;

    @AllowNull(false)
    @Column(DataType.STRING)
    declare url: string;
}
