import { Module, OnModuleInit } from "@nestjs/common";
import { applyAssociations } from "./associations.service";

@Module({})
export class AssociationsModule implements OnModuleInit {
    constructor() {}
    onModuleInit() {
        applyAssociations();
    }
}
