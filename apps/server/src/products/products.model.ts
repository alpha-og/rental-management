import { ProductTable } from "./products.table";
import { Rate } from "src/rates/rate.model";
import { Attachment } from "src/attachments/attachment.model";
import { Reservation } from "src/reservations/reservation.model";
import { Quotation } from "src/quotations/quotation.model";
import { HasMany, BelongsToMany } from "sequelize-typescript";

export class Product extends ProductTable {
    @HasMany(() => Rate)
    declare rates: Rate[];

    @HasMany(() => Attachment)
    declare attachments: Attachment[];

    @HasMany(() => Reservation)
    declare reservations: Reservation[];

    @BelongsToMany(() => Quotation, {
        through: "productQuotation",
    })
    declare quotations: Quotation[];
}
