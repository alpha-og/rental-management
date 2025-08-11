import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from "@nestjs/common";
import { RatesService } from "./rates.service";
import { CreateRateDto, UpdateRateDto } from "./rates.dto";
import { Rate } from "./rate.model";

@Controller("rates")
export class RatesController {
    constructor(private readonly ratesService: RatesService) {}

    @Get()
    async findAll(): Promise<Rate[]> {
        return this.ratesService.findAll();
    }

    @Get(":id")
    async findOne(@Param("id") id: string): Promise<Rate | null> {
        return this.ratesService.findOne(id);
    }

    @Get("product/:productId")
    async findByProduct(
        @Param("productId") productId: string,
    ): Promise<Rate[]> {
        return this.ratesService.findByProduct(productId);
    }

    @Post()
    async create(@Body() dto: CreateRateDto): Promise<Rate> {
        return this.ratesService.create(dto);
    }

    @Put(":id")
    async update(
        @Param("id") id: string,
        @Body() dto: UpdateRateDto,
    ): Promise<Rate> {
        return this.ratesService.update(id, dto);
    }

    @Delete(":id")
    async delete(@Param("id") id: string): Promise<void> {
        return this.ratesService.delete(id);
    }
}
