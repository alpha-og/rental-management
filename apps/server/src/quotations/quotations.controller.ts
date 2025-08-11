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
import { QuotationsService } from "./quotations.service";
import { CreateQuotationDto, UpdateQuotationDto } from "./quotations.dto";
import { Quotation } from "./quotation.model";
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiBearerAuth,
} from "@nestjs/swagger";

@ApiTags("quotations")
@ApiBearerAuth()
@Controller("quotations")
export class QuotationsController {
    constructor(private readonly quotationsService: QuotationsService) {}

    @Get()
    @ApiOperation({ summary: "Get all quotations" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Return all quotations.",
        type: [Quotation],
    })
    async findAll(): Promise<Quotation[]> {
        return this.quotationsService.findAll();
    }

    @Get(":id")
    @ApiOperation({ summary: "Get a quotation by id" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Return the quotation.",
        type: Quotation,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Quotation not found.",
    })
    async findOne(@Param("id") id: string): Promise<Quotation | null> {
        return this.quotationsService.findOne(id);
    }

    @Get("product/:productId")
    @ApiOperation({ summary: "Get quotations by product id" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Return quotations by product id.",
        type: [Quotation],
    })
    async findByProduct(
        @Param("productId") productId: string,
    ): Promise<Quotation[]> {
        return this.quotationsService.findByProduct(productId);
    }

    @Post()
    @ApiOperation({ summary: "Create a new quotation" })
    @ApiBody({ type: CreateQuotationDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "The quotation has been successfully created.",
        type: Quotation,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Bad request.",
    })
    async create(@Body() dto: CreateQuotationDto): Promise<Quotation> {
        return this.quotationsService.create(dto);
    }

    @Put(":id")
    @ApiOperation({ summary: "Update a quotation" })
    @ApiBody({ type: UpdateQuotationDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "The quotation has been successfully updated.",
        type: Quotation,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Quotation not found.",
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Bad request.",
    })
    async update(
        @Param("id") id: string,
        @Body() dto: UpdateQuotationDto,
    ): Promise<Quotation> {
        return this.quotationsService.update(id, dto);
    }

    @Delete(":id")
    @ApiOperation({ summary: "Delete a quotation" })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: "The quotation has been successfully deleted.",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Quotation not found.",
    })
    async delete(@Param("id") id: string): Promise<void> {
        return this.quotationsService.delete(id);
    }
}
