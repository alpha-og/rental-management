import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Rate, RateDuration } from "./rate.model";
import { CreateRateDto, UpdateRateDto } from "./rates.dto";

@Injectable()
export class RatesService {
    constructor(
        @InjectModel(Rate)
        private readonly rateModel: typeof Rate,
    ) {}

    async create(dto: CreateRateDto): Promise<Rate> {
        return this.rateModel.create(dto);
    }

    async findAll(): Promise<Rate[]> {
        return this.rateModel.findAll();
    }

    async findOne(id: string): Promise<Rate | null> {
        return this.rateModel.findByPk(id);
    }

    async update(id: string, dto: UpdateRateDto): Promise<Rate> {
        const rate = await this.findOne(id);
        if (!rate) throw new NotFoundException("Rate not found");
        return rate.update(dto);
    }

    async delete(id: string): Promise<void> {
        const rate = await this.findOne(id);
        if (rate) await rate.destroy();
    }

    async findByProduct(productId: string): Promise<Rate[]> {
        return this.rateModel.findAll({ where: { productId } });
    }

    async findByProductAndDuration(
        productId: string,
        duration: RateDuration,
    ): Promise<Rate | null> {
        return this.rateModel.findOne({ where: { productId, duration } });
    }
}
