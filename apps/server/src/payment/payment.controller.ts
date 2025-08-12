import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    HttpCode,
    HttpStatus,
    Logger,
    BadRequestException,
    Headers,
    UseGuards,
} from "@nestjs/common";
import { PaymentService } from "./payment.service";
import {
    CreatePaymentDto,
    CapturePaymentDto,
    RefundPaymentDto,
    PaymentResponseDto,
} from "./payment.dto";
import { AuthGuard } from "../auth/auth.guard";
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiParam,
    ApiBearerAuth,
} from "@nestjs/swagger";

interface PayPalWebhookEvent {
    event_type: string;
    resource: {
        id: string;
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

@ApiBearerAuth()
@ApiTags("Payment")
@Controller("payment")
export class PaymentController {
    private readonly logger = new Logger(PaymentController.name);

    constructor(private readonly paymentService: PaymentService) {}

    /**
     * Create a new PayPal payment order
     * POST /payment/create
     */
    @Post("create")
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: "Create a new PayPal payment order" })
    @ApiBody({ type: CreatePaymentDto, description: "Payment order details" })
    @ApiResponse({
        status: 201,
        description: "Payment order created successfully",
        type: PaymentResponseDto,
    })
    @ApiResponse({ status: 400, description: "Bad Request" })
    @ApiResponse({ status: 500, description: "Internal Server Error" })
    async createPayment(
        @Body() createPaymentDto: CreatePaymentDto,
    ): Promise<PaymentResponseDto> {
        this.logger.log("Creating new PayPal payment");
        try {
            return await this.paymentService.createPayment(createPaymentDto);
        } catch (error) {
            this.logger.error("Failed to create payment:", error);
            throw error;
        }
    }

    /**
     * Capture a PayPal payment (complete the transaction)
     * POST /payment/capture
     */
    @Post("capture")
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: "Capture a PayPal payment (complete the transaction)",
    })
    @ApiBody({
        type: CapturePaymentDto,
        description: "Payment capture details",
    })
    @ApiResponse({
        status: 200,
        description: "Payment captured successfully",
        type: PaymentResponseDto,
    })
    @ApiResponse({ status: 400, description: "Bad Request" })
    @ApiResponse({ status: 500, description: "Internal Server Error" })
    async capturePayment(
        @Body() capturePaymentDto: CapturePaymentDto,
    ): Promise<PaymentResponseDto> {
        this.logger.log(
            `Capturing PayPal payment: ${capturePaymentDto.payment_id}`,
        );
        try {
            return await this.paymentService.capturePayment(capturePaymentDto);
        } catch (error) {
            this.logger.error("Failed to capture payment:", error);
            throw error;
        }
    }

    /**
     * Get payment details by ID
     * GET /payment/:id
     */
    @Get(":id")
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: "Get payment details by ID" })
    @ApiParam({ name: "id", description: "Payment ID", type: String })
    @ApiResponse({
        status: 200,
        description: "Payment details retrieved successfully",
        type: PaymentResponseDto,
    })
    @ApiResponse({ status: 400, description: "Bad Request" })
    @ApiResponse({ status: 500, description: "Internal Server Error" })
    async getPayment(
        @Param("id") paymentId: string,
    ): Promise<PaymentResponseDto> {
        this.logger.log(`Getting PayPal payment: ${paymentId}`);
        try {
            return await this.paymentService.getPayment(paymentId);
        } catch (error) {
            this.logger.error("Failed to get payment:", error);
            throw error;
        }
    }

    /**
     * Refund a captured payment
     * POST /payment/refund
     */
    @Post("refund")
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Refund a captured payment" })
    @ApiBody({ type: RefundPaymentDto, description: "Refund details" })
    @ApiResponse({ status: 200, description: "Payment refunded successfully" })
    @ApiResponse({ status: 400, description: "Bad Request" })
    @ApiResponse({ status: 500, description: "Internal Server Error" })
    async refundPayment(
        @Body() refundPaymentDto: RefundPaymentDto,
    ): Promise<unknown> {
        this.logger.log(
            `Refunding PayPal payment: ${refundPaymentDto.capture_id}`,
        );
        try {
            return await this.paymentService.refundPayment(refundPaymentDto);
        } catch (error) {
            this.logger.error("Failed to refund payment:", error);
            throw error;
        }
    }

    /**
     * Generate client token for PayPal client-side SDK
     * GET /payment/client-token
     */
    @Get("client-token")
    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: "Generate client token for PayPal client-side SDK",
    })
    @ApiResponse({
        status: 200,
        description: "Client token generated successfully",
        schema: { example: { client_token: "YOUR_CLIENT_TOKEN" } },
    })
    @ApiResponse({ status: 500, description: "Internal Server Error" })
    generateClientToken(): { client_token: string } {
        this.logger.log("Generating PayPal client token");
        try {
            return this.paymentService.generateClientToken();
        } catch (error) {
            this.logger.error("Failed to generate client token:", error);
            throw error;
        }
    }

    /**
     * PayPal webhook endpoint for payment notifications
     * POST /payment/webhook
     * This endpoint should be configured in PayPal Developer Dashboard
     */
    @Post("webhook")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: "PayPal webhook endpoint for payment notifications",
    })
    @ApiBody({
        description: "PayPal webhook event payload",
        schema: {
            example: {
                event_type: "PAYMENT.CAPTURE.COMPLETED",
                resource: { id: "some_id" },
            },
        },
    })
    @ApiResponse({ status: 200, description: "Webhook processed successfully" })
    @ApiResponse({
        status: 400,
        description: "Bad Request (e.g., invalid signature)",
    })
    @ApiResponse({ status: 500, description: "Internal Server Error" })
    handleWebhook(
        @Headers() headers: Record<string, unknown>,
        @Body() body: PayPalWebhookEvent,
    ): { status: string } {
        this.logger.log("Received PayPal webhook");
        try {
            // Verify webhook signature
            const isValid = this.paymentService.verifyWebhookSignature();

            if (!isValid) {
                this.logger.warn("Invalid webhook signature");
                throw new BadRequestException("Invalid webhook signature");
            }

            // Process webhook event
            const eventType = body.event_type;
            const resource = body.resource;

            this.logger.log(`Processing webhook event: ${eventType}`);

            switch (eventType) {
                case "PAYMENT.CAPTURE.COMPLETED":
                    this.logger.log(`Payment captured: ${resource.id}`);
                    // Handle successful payment capture
                    break;

                case "PAYMENT.CAPTURE.DENIED":
                    this.logger.log(`Payment denied: ${resource.id}`);
                    // Handle payment denial
                    break;

                case "PAYMENT.CAPTURE.REFUNDED":
                    this.logger.log(`Payment refunded: ${resource.id}`);
                    // Handle payment refund
                    break;

                case "CHECKOUT.ORDER.APPROVED":
                    this.logger.log(`Order approved: ${resource.id}`);
                    // Handle order approval
                    break;

                case "CHECKOUT.ORDER.COMPLETED":
                    this.logger.log(`Order completed: ${resource.id}`);
                    // Handle order completion
                    break;

                default:
                    this.logger.log(`Unhandled webhook event: ${eventType}`);
            }

            return { status: "success" };
        } catch (error) {
            this.logger.error("Failed to process webhook:", error);
            throw error;
        }
    }

    /**
     * Health check endpoint for PayPal integration
     * GET /payment/health
     */
    @Get("health")
    @ApiOperation({ summary: "Health check endpoint for PayPal integration" })
    @ApiResponse({
        status: 200,
        description: "PayPal integration is working correctly",
        schema: {
            example: {
                status: "healthy",
                message: "PayPal integration is working correctly",
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: "PayPal integration is not working",
        schema: {
            example: {
                status: "unhealthy",
                message: "PayPal integration is not working",
            },
        },
    })
    healthCheck(): { status: string; message: string } {
        try {
            // Generate a client token to test PayPal connectivity
            this.paymentService.generateClientToken();

            return {
                status: "healthy",
                message: "PayPal integration is working correctly",
            };
        } catch (error) {
            this.logger.error("PayPal health check failed:", error);
            return {
                status: "unhealthy",
                message: "PayPal integration is not working",
            };
        }
    }
}
