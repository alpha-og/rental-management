import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    HttpStatus,
} from "@nestjs/common";
import { AttachmentsService } from "./attachments.service";
import { CreateAttachmentDto, UpdateAttachmentDto } from "./attachments.dto";
import { Attachment } from "./attachment.model";
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiBearerAuth,
} from "@nestjs/swagger";

@ApiTags("attachments")
@ApiBearerAuth()
@Controller("attachments")
export class AttachmentsController {
    constructor(private readonly attachmentsService: AttachmentsService) {}

    @Get()
    @ApiOperation({ summary: "Get all attachments" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Return all attachments.",
        type: [Attachment],
    })
    async findAll(): Promise<Attachment[]> {
        return this.attachmentsService.findAll();
    }

    @Get(":id")
    @ApiOperation({ summary: "Get an attachment by id" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Return the attachment.",
        type: Attachment,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Attachment not found.",
    })
    async findOne(@Param("id") id: string): Promise<Attachment | null> {
        return this.attachmentsService.findOne(id);
    }

    @Get("product/:productId")
    @ApiOperation({ summary: "Get attachments by product id" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Return attachments by product id.",
        type: [Attachment],
    })
    async findByProduct(
        @Param("productId") productId: string,
    ): Promise<Attachment[]> {
        return this.attachmentsService.findByProduct(productId);
    }

    @Post()
    @ApiOperation({ summary: "Create a new attachment" })
    @ApiBody({ type: CreateAttachmentDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "The attachment has been successfully created.",
        type: Attachment,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Bad request.",
    })
    async create(@Body() dto: CreateAttachmentDto): Promise<Attachment> {
        return this.attachmentsService.create(dto);
    }

    @Put(":id")
    @ApiOperation({ summary: "Update an attachment" })
    @ApiBody({ type: UpdateAttachmentDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "The attachment has been successfully updated.",
        type: Attachment,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Attachment not found.",
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Bad request.",
    })
    async update(
        @Param("id") id: string,
        @Body() dto: UpdateAttachmentDto,
    ): Promise<Attachment> {
        return this.attachmentsService.update(id, dto);
    }

    @Delete(":id")
    @ApiOperation({ summary: "Delete an attachment" })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: "The attachment has been successfully deleted.",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Attachment not found.",
    })
    async delete(@Param("id") id: string): Promise<void> {
        return this.attachmentsService.delete(id);
    }
}
