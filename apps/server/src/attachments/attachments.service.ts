import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Attachment } from "./attachment.model";
import { CreateAttachmentDto, UpdateAttachmentDto } from "./attachments.dto";

@Injectable()
export class AttachmentsService {
    constructor(
        @InjectModel(Attachment)
        private readonly attachmentModel: typeof Attachment,
    ) {}

    async create(dto: CreateAttachmentDto): Promise<Attachment> {
        return this.attachmentModel.create(dto);
    }

    async findAll(): Promise<Attachment[]> {
        return this.attachmentModel.findAll();
    }

    async findOne(id: string): Promise<Attachment | null> {
        return this.attachmentModel.findByPk(id);
    }

    async update(id: string, dto: UpdateAttachmentDto): Promise<Attachment> {
        const attachment = await this.findOne(id);
        if (!attachment) throw new NotFoundException("Attachment not found");
        return attachment.update(dto);
    }

    async delete(id: string): Promise<void> {
        const attachment = await this.findOne(id);
        if (attachment) await attachment.destroy();
    }

    async findByProduct(productId: string): Promise<Attachment[]> {
        return this.attachmentModel.findAll({ where: { productId } });
    }
}
