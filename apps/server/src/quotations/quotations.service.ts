import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Quotation } from "./quotation.model";
import { CreateQuotationDto, UpdateQuotationDto } from "./quotations.dto";

@Injectable()
export class QuotationsService {
    constructor(
        @InjectModel(Quotation)
        private readonly quotationModel: typeof Quotation,
    ) {}

    async create(dto: CreateQuotationDto): Promise<Quotation> {
        return this.quotationModel.create(dto);
    }

    async findAll(): Promise<Quotation[]> {
        return this.quotationModel.findAll();
    }

    async findOne(id: string): Promise<Quotation | null> {
        return this.quotationModel.findByPk(id);
    }

    async update(id: string, dto: UpdateQuotationDto): Promise<Quotation> {
        const quotation = await this.findOne(id);
        if (!quotation) throw new NotFoundException("Quotation not found");
        return quotation.update(dto);
    }

    async delete(id: string): Promise<void> {
        const quotation = await this.findOne(id);
        if (quotation) await quotation.destroy();
    }

    async findByProduct(productId: string): Promise<Quotation[]> {
        return this.quotationModel.findAll({ where: { productId } });
    }
}
