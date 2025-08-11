import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from "@nestjs/common";
import { ContractsService } from "./contracts.service";
import { CreateContractDto, UpdateContractDto } from "./contracts.dto";
import { Contract } from "./contract.model";

@Controller("contracts")
export class ContractsController {
    constructor(private readonly contractsService: ContractsService) {}

    @Get()
    async findAll(): Promise<Contract[]> {
        return this.contractsService.findAll();
    }

    @Get(":id")
    async findOne(@Param("id") id: string): Promise<Contract | null> {
        return this.contractsService.findOne(id);
    }

    @Get("order/:orderId")
    async findByOrder(@Param("orderId") orderId: string): Promise<Contract[]> {
        return this.contractsService.findByOrder(orderId);
    }

    @Post()
    async create(@Body() dto: CreateContractDto): Promise<Contract> {
        return this.contractsService.create(dto);
    }

    @Put(":id")
    async update(
        @Param("id") id: string,
        @Body() dto: UpdateContractDto,
    ): Promise<Contract> {
        return this.contractsService.update(id, dto);
    }

    @Delete(":id")
    async delete(@Param("id") id: string): Promise<void> {
        return this.contractsService.delete(id);
    }
}
