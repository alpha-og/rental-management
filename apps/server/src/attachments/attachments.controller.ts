import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from "@nestjs/common";
import { AttachmentsService } from "./attachments.service";
import { CreateAttachmentDto, UpdateAttachmentDto } from "./attachments.dto";
import { Attachment } from "./attachment.model";

@Controller("attachments")
export class AttachmentsController {
    constructor(private readonly attachmentsService: AttachmentsService) {}

    @Get()
    async findAll(): Promise<Attachment[]> {
        return this.attachmentsService.findAll();
    }

    @Get(":id")
    async findOne(@Param("id") id: string): Promise<Attachment | null> {
        return this.attachmentsService.findOne(id);
    }

    @Get("product/:productId")
    async findByProduct(
        @Param("productId") productId: string,
    ): Promise<Attachment[]> {
        return this.attachmentsService.findByProduct(productId);
    }

    @Post()
    async create(@Body() dto: CreateAttachmentDto): Promise<Attachment> {
        return this.attachmentsService.create(dto);
    }

    @Put(":id")
    async update(
        @Param("id") id: string,
        @Body() dto: UpdateAttachmentDto,
    ): Promise<Attachment> {
        return this.attachmentsService.update(id, dto);
    }

    @Delete(":id")
    async delete(@Param("id") id: string): Promise<void> {
        return this.attachmentsService.delete(id);
    }
}
