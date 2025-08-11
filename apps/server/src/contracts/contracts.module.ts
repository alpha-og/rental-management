import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Contract } from "./contract.model";
import { ContractsService } from "./contracts.service";
import { ContractsController } from "./contracts.controller";

@Module({
    imports: [SequelizeModule.forFeature([Contract])],
    providers: [ContractsService],
    controllers: [ContractsController],
    exports: [ContractsService],
})
export class ContractsModule {}
