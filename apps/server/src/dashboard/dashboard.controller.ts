import { Controller, Get, UseGuards } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { AuthGuard } from "../auth/auth.guard";
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags("Dashboard")
@Controller("dashboard")
@UseGuards(AuthGuard)
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get("stats")
    @ApiOperation({ summary: "Get overall statistics for the dashboard" })
    @ApiResponse({ status: 200, description: "Returns dashboard statistics." })
    async getStats() {
        return this.dashboardService.getStats();
    }

    @Get("top-product-categories")
    @ApiOperation({ summary: "Get top product categories by order/revenue" })
    @ApiResponse({
        status: 200,
        description: "Returns a list of top product categories.",
    })
    async getTopProductCategories() {
        return this.dashboardService.getTopProductCategories();
    }

    @Get("top-products")
    @ApiOperation({ summary: "Get top products by order/revenue" })
    @ApiResponse({
        status: 200,
        description: "Returns a list of top products.",
    })
    async getTopProducts() {
        return this.dashboardService.getTopProducts();
    }

    @Get("top-customers")
    @ApiOperation({ summary: "Get top customers by order/revenue" })
    @ApiResponse({
        status: 200,
        description: "Returns a list of top customers.",
    })
    async getTopCustomers() {
        return this.dashboardService.getTopCustomers();
    }
}
