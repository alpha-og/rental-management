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
import { ContractsService } from "./contracts.service";
import { CreateContractDto, UpdateContractDto } from "./contracts.dto";
import { Contract } from "./contract.model";
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiBearerAuth,
} from "@nestjs/swagger";

@ApiTags("contracts")
@ApiBearerAuth()
@Controller("contracts")
export class ContractsController {
    constructor(private readonly contractsService: ContractsService) {}

    @Get()
    @ApiOperation({ summary: "Get all contracts" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Return all contracts.",
        type: [Contract],
    })
    async findAll(): Promise<Contract[]> {
        return this.contractsService.findAll();
    }

    @Get(":id")
    @ApiOperation({ summary: "Get a contract by id" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Return the contract.",
        type: Contract,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Contract not found.",
    })
    async findOne(@Param("id") id: string): Promise<Contract | null> {
        return this.contractsService.findOne(id);
    }

    @Get("order/:orderId")
    @ApiOperation({ summary: "Get contracts by order id" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Return contracts by order id.",
        type: [Contract],
    })
    async findByOrder(@Param("orderId") orderId: string): Promise<Contract[]> {
        return this.contractsService.findByOrder(orderId);
    }

    @Post()
    @ApiOperation({ summary: "Create a new contract" })
    @ApiBody({ type: CreateContractDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "The contract has been successfully created.",
        type: Contract,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Bad request.",
    })
    async create(@Body() dto: CreateContractDto): Promise<Contract> {
        return this.contractsService.create(dto);
    }

    @Put(":id")
    @ApiOperation({ summary: "Update a contract" })
    @ApiBody({ type: UpdateContractDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "The contract has been successfully updated.",
        type: Contract,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Contract not found.",
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Bad request.",
    })
    async update(
        @Param("id") id: string,
        @Body() dto: UpdateContractDto,
    ): Promise<Contract> {
        return this.contractsService.update(id, dto);
    }

    @Delete(":id")
    @ApiOperation({ summary: "Delete a contract" })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: "The contract has been successfully deleted.",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Contract not found.",
    })
    async delete(@Param("id") id: string): Promise<void> {
        return this.contractsService.delete(id);
    }
}
