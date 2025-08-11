import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Attachment } from "./attachment.model";
import { AttachmentsService } from "./attachments.service";
import { AttachmentsController } from "./attachments.controller";

@Module({
    imports: [SequelizeModule.forFeature([Attachment])],
    providers: [AttachmentsService],
    controllers: [AttachmentsController],
    exports: [AttachmentsService],
})
export class AttachmentsModule {}
