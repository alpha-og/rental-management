import { QuotationTable } from "./quotation.table";
import { Product } from "../products/products.model";
import { Rate } from "../rates/rate.model";
import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    HasOne,
    AllowNull,
} from "sequelize-typescript";

export class Quotation extends QuotationTable {
    @ForeignKey(() => Product)
    @AllowNull(false)
    @Column(DataType.UUID)
    declare productId: string;

    @BelongsTo(() => Product)
    declare product?: Product;

    @ForeignKey(() => Rate)
    @AllowNull(false)
    @Column(DataType.UUID)
    declare rateId: string;

    @HasOne(() => Rate)
    declare rate?: Rate;
}
