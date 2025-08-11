import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Attachment } from "./attachment.model";
import { CreateAttachmentDto, UpdateAttachmentDto } from "./attachments.dto";
import { AppwriteService } from "src/config/appwrite.config";
import { ID } from "node-appwrite";

@Injectable()
export class AttachmentsService {
    constructor(
        private appwriteService: AppwriteService,
        @InjectModel(Attachment)
        private readonly attachmentModel: typeof Attachment,
    ) {}

    async uploadImage(dto: CreateAttachmentDto): Promise<Attachment> {
        try {
            const storage = this.appwriteService.getStorage();
            const bucketId = this.appwriteService.getBucketId();
            const projectId = this.appwriteService.getProjectId();

            // Upload to Appwrite
            const uploadResult = await storage.createFile(
                bucketId,
                ID.unique(),
                dto.file,
            );

            // Get file URL
            const fileUrl = `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${uploadResult.$id}/view?project=${projectId}`;

            // Save metadata to database
            const attachment = await this.attachmentModel.create({
                productId: dto.productId,
                appwriteFileId: uploadResult.$id,
                fileName: dto.file.name,
                mimeType: dto.file.type,
                fileSize: dto.file.size,
                fileUrl: fileUrl,
            });

            return attachment;
        } catch {
            throw new BadRequestException("Failed to upload image!");
        }
    }

    async getProductAttachments(productId: string): Promise<Attachment[]> {
        return this.attachmentModel.findAll({
            where: { productId },
        });
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

    async deleteAttachment(attachmentId: string): Promise<void> {
        const attachment = await this.attachmentModel.findByPk(attachmentId);
        if (!attachment) {
            throw new BadRequestException("Attachment not found");
        }

        try {
            const storage = this.appwriteService.getStorage();
            const bucketId = this.appwriteService.getBucketId();

            // Delete from Appwrite
            await storage.deleteFile(bucketId, attachment.appwriteFileId);

            // Delete from database
            await attachment.destroy();
        } catch {
            throw new BadRequestException("Failed to delete attachment!");
        }
    }
    async delete(id: string): Promise<void> {
        const attachment = await this.findOne(id);
        if (attachment) await attachment.destroy();
    }

    async findByProduct(productId: string): Promise<Attachment[]> {
        return this.attachmentModel.findAll({ where: { productId } });
    }
}
