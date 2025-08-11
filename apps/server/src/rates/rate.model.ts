import { RateTable } from "./rates.table";
export { RateDuration } from "./rates.table";
import { Product } from "../products/products.model";
import { Quotation } from "../quotations/quotation.model";
import {
    AllowNull,
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    ForeignKey,
} from "sequelize-typescript";

export class Rate extends RateTable {
    @ForeignKey(() => Product)
    @AllowNull(false)
    @Column(DataType.UUID)
    declare productId: string;

    @BelongsTo(() => Product)
    declare product: Product;

    @BelongsToMany(() => Quotation, { through: "quotationRates" })
    declare quotations: Quotation[];
}
