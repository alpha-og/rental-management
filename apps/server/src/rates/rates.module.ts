import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Rate } from "./rate.model";
import { RatesService } from "./rates.service";
import { RatesController } from "./rates.controller";

@Module({
    imports: [SequelizeModule.forFeature([Rate])],
    providers: [RatesService],
    controllers: [RatesController],
    exports: [RatesService],
})
export class RatesModule {}
