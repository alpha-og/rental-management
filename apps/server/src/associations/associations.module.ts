import { Inject, Module, OnModuleInit } from "@nestjs/common";
import { applyAssociations } from "./associations.service";
import { Sequelize } from "sequelize-typescript";

@Module({})
export class AssociationsModule implements OnModuleInit {
    constructor(@Inject(Sequelize) private readonly sequelize: Sequelize) {}
    onModuleInit() {
        console.log("Applying associations...", this.sequelize);
        applyAssociations();
    }
}
