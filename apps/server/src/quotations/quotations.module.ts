import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Quotation } from "./quotation.model";
import { QuotationsService } from "./quotations.service";
import { QuotationsController } from "./quotations.controller";

@Module({
    imports: [SequelizeModule.forFeature([Quotation])],
    providers: [QuotationsService],
    controllers: [QuotationsController],
    exports: [QuotationsService],
})
export class QuotationsModule {}
