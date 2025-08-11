import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Contract } from "./contract.model";
import { CreateContractDto, UpdateContractDto } from "./contracts.dto";

@Injectable()
export class ContractsService {
    constructor(
        @InjectModel(Contract) private readonly contractModel: typeof Contract,
    ) {}

    async create(dto: CreateContractDto): Promise<Contract> {
        return this.contractModel.create({
            ...dto,
            startDate: new Date(dto.startDate),
        });
    }

    async findAll(): Promise<Contract[]> {
        return this.contractModel.findAll();
    }

    async findOne(id: string): Promise<Contract | null> {
        return this.contractModel.findByPk(id);
    }

    async update(id: string, dto: UpdateContractDto): Promise<Contract> {
        const contract = await this.findOne(id);
        if (!contract) throw new NotFoundException("Contract not found");
        return contract.update({
            ...dto,
            startDate: dto.startDate
                ? new Date(dto.startDate)
                : contract.startDate,
        });
    }

    async delete(id: string): Promise<void> {
        const contract = await this.findOne(id);
        if (contract) await contract.destroy();
    }

    async findByOrder(orderId: string): Promise<Contract[]> {
        return this.contractModel.findAll({ where: { orderId } });
    }
}
