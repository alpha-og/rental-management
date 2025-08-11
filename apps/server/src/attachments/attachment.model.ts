import { AttachmentTable } from "./attachments.table";
import { Product } from "../products/products.model";
import {
    AllowNull,
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
} from "sequelize-typescript";

export class Attachment extends AttachmentTable {
    @ForeignKey(() => Product)
    @AllowNull(false)
    @Column(DataType.UUID)
    declare productId: string;

    @BelongsTo(() => Product)
    declare product?: Product;
}
