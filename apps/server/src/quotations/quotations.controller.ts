import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from "@nestjs/common";
import { QuotationsService } from "./quotations.service";
import { CreateQuotationDto, UpdateQuotationDto } from "./quotations.dto";
import { Quotation } from "./quotation.model";

@Controller("quotations")
export class QuotationsController {
    constructor(private readonly quotationsService: QuotationsService) {}

    @Get()
    async findAll(): Promise<Quotation[]> {
        return this.quotationsService.findAll();
    }

    @Get(":id")
    async findOne(@Param("id") id: string): Promise<Quotation | null> {
        return this.quotationsService.findOne(id);
    }

    @Get("product/:productId")
    async findByProduct(
        @Param("productId") productId: string,
    ): Promise<Quotation[]> {
        return this.quotationsService.findByProduct(productId);
    }

    @Post()
    async create(@Body() dto: CreateQuotationDto): Promise<Quotation> {
        return this.quotationsService.create(dto);
    }

    @Put(":id")
    async update(
        @Param("id") id: string,
        @Body() dto: UpdateQuotationDto,
    ): Promise<Quotation> {
        return this.quotationsService.update(id, dto);
    }

    @Delete(":id")
    async delete(@Param("id") id: string): Promise<void> {
        return this.quotationsService.delete(id);
    }
}
