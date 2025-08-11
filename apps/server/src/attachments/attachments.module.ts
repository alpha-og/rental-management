import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Attachment } from "./attachment.model";
import { AttachmentsService } from "./attachments.service";
import { AttachmentsController } from "./attachments.controller";
import { AppwriteService } from "src/config/appwrite.config";

@Module({
    imports: [SequelizeModule.forFeature([Attachment])],
    providers: [AttachmentsService, AppwriteService],
    controllers: [AttachmentsController],
    exports: [AttachmentsService, AppwriteService],
})
export class AttachmentsModule {}
