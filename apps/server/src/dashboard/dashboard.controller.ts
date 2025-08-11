import { Controller, Get } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";

@Controller("dashboard")
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get("stats")
    async getStats() {
        return this.dashboardService.getStats();
    }

    @Get("product-categories")
    async getTopProductCategories() {
        return this.dashboardService.getTopProductCategories();
    }

    @Get("top-products")
    async getTopProducts() {
        return this.dashboardService.getTopProducts();
    }

    @Get("top-customers")
    async getTopCustomers() {
        return this.dashboardService.getTopCustomers();
    }
}
