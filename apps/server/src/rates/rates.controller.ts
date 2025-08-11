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
import { RatesService } from "./rates.service";
import { CreateRateDto, UpdateRateDto } from "./rates.dto";
import { Rate } from "./rate.model";
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiBearerAuth,
} from "@nestjs/swagger";

@ApiTags("rates")
@ApiBearerAuth()
@Controller("rates")
export class RatesController {
    constructor(private readonly ratesService: RatesService) {}

    @Get()
    @ApiOperation({ summary: "Get all rates" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Return all rates.",
        type: [Rate],
    })
    async findAll(): Promise<Rate[]> {
        return this.ratesService.findAll();
    }

    @Get(":id")
    @ApiOperation({ summary: "Get a rate by id" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Return the rate.",
        type: Rate,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Rate not found.",
    })
    async findOne(@Param("id") id: string): Promise<Rate | null> {
        return this.ratesService.findOne(id);
    }

    @Get("product/:productId")
    @ApiOperation({ summary: "Get rates by product id" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Return rates by product id.",
        type: [Rate],
    })
    async findByProduct(
        @Param("productId") productId: string,
    ): Promise<Rate[]> {
        return this.ratesService.findByProduct(productId);
    }

    @Post()
    @ApiOperation({ summary: "Create a new rate" })
    @ApiBody({ type: CreateRateDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "The rate has been successfully created.",
        type: Rate,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Bad request.",
    })
    async create(@Body() dto: CreateRateDto): Promise<Rate> {
        return this.ratesService.create(dto);
    }

    @Put(":id")
    @ApiOperation({ summary: "Update a rate" })
    @ApiBody({ type: UpdateRateDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "The rate has been successfully updated.",
        type: Rate,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Rate not found.",
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Bad request.",
    })
    async update(
        @Param("id") id: string,
        @Body() dto: UpdateRateDto,
    ): Promise<Rate> {
        return this.ratesService.update(id, dto);
    }

    @Delete(":id")
    @ApiOperation({ summary: "Delete a rate" })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: "The rate has been successfully deleted.",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Rate not found.",
    })
    async delete(@Param("id") id: string): Promise<void> {
        return this.ratesService.delete(id);
    }
}
