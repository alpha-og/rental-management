import {
    Injectable,
    Logger,
    BadRequestException,
    InternalServerErrorException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
    Client,
    Environment,
    OrdersController,
    PaymentsController,
    CheckoutPaymentIntent,
    OrderApplicationContextLandingPage,
    OrderApplicationContextUserAction,
    OrderApplicationContextShippingPreference,
} from "@paypal/paypal-server-sdk";
import {
    CreatePaymentDto,
    CapturePaymentDto,
    RefundPaymentDto,
    PaymentResponseDto,
    PaymentStatus,
    PaymentIntent,
} from "./payment.dto";

@Injectable()
export class PaymentService {
    private readonly logger = new Logger(PaymentService.name);
    private paypalClient!: Client;
    private ordersController!: OrdersController;
    private paymentsController!: PaymentsController;

    constructor(private configService: ConfigService) {
        this.initializePayPalClient();
    }

    private initializePayPalClient() {
        const clientId = this.configService.get<string>("PAYPAL_CLIENT_ID");
        const clientSecret = this.configService.get<string>(
            "PAYPAL_CLIENT_SECRET",
        );
        const environment = this.configService.get<string>("NODE_ENV");

        if (!clientId || !clientSecret) {
            throw new Error("PayPal credentials are not configured");
        }

        this.paypalClient = new Client({
            clientCredentialsAuthCredentials: {
                oAuthClientId: clientId,
                oAuthClientSecret: clientSecret,
            },
            environment:
                environment === "production"
                    ? Environment.Production
                    : Environment.Sandbox,
        });

        this.ordersController = new OrdersController(this.paypalClient);
        this.paymentsController = new PaymentsController(this.paypalClient);

        this.logger.log(
            `PayPal client initialized for ${environment === "production" ? "Production" : "Sandbox"} environment`,
        );
    }

    /**
     * Create a PayPal order using REST API approach
     */
    async createPayment(
        createPaymentDto: CreatePaymentDto,
    ): Promise<PaymentResponseDto> {
        try {
            const {
                intent,
                amount,
                description,
                custom_id,
                return_url,
                cancel_url,
                payer,
            } = createPaymentDto;

            const request = {
                body: {
                    intent:
                        intent === PaymentIntent.CAPTURE
                            ? CheckoutPaymentIntent.Capture
                            : CheckoutPaymentIntent.Authorize,
                    purchaseUnits: [
                        {
                            amount: {
                                currencyCode: amount.currency_code,
                                value: amount.value,
                            },
                            description: description,
                            customId: custom_id,
                        },
                    ],
                    applicationContext: {
                        returnUrl:
                            return_url ||
                            `${this.configService.get("FRONTEND_URL")}/payment/success`,
                        cancelUrl:
                            cancel_url ||
                            `${this.configService.get("FRONTEND_URL")}/payment/cancel`,
                        brandName: "Rental Management System",
                        landingPage: OrderApplicationContextLandingPage.Login,
                        userAction: OrderApplicationContextUserAction.PayNow,
                        shippingPreference:
                            OrderApplicationContextShippingPreference.NoShipping,
                    },
                    payer: payer
                        ? {
                              emailAddress: payer.email_address,
                              name: {
                                  givenName: payer.given_name,
                                  surname: payer.surname,
                              },
                          }
                        : undefined,
                },
            };

            this.logger.log("Creating PayPal order...");
            this.logger.debug(
                "PayPal order request:",
                JSON.stringify(request, null, 2),
            );

            const response = await this.ordersController.createOrder({
                body: request.body,
            });

            if (response.statusCode !== 201) {
                this.logger.error(
                    "PayPal order creation failed:",
                    response.result,
                );
                throw new BadRequestException("Failed to create PayPal order");
            }

            const order = response.result;
            const approvalUrl = order.links?.find(
                (link) => link.rel === "approve",
            )?.href;

            const paymentResponse: PaymentResponseDto = {
                id: order.id!,
                status: order.status as unknown as PaymentStatus,
                amount: {
                    currency_code: amount.currency_code,
                    value: amount.value,
                },
                approval_url: approvalUrl,
                create_time: order.createTime,
                update_time: order.updateTime,
            };

            this.logger.log(`PayPal order created successfully: ${order.id}`);
            return paymentResponse;
        } catch (error) {
            this.logger.error("Error creating PayPal payment:", error);
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException("Failed to create payment");
        }
    }

    /**
     * Capture a PayPal order (complete the payment)
     */
    async capturePayment(
        capturePaymentDto: CapturePaymentDto,
    ): Promise<PaymentResponseDto> {
        try {
            const { payment_id, amount, note_to_payer } = capturePaymentDto;

            const request = {
                id: payment_id,
                body: {
                    note_to_payer: note_to_payer,
                    ...(amount && {
                        amount: {
                            currency_code: amount.currency_code,
                            value: amount.value,
                        },
                    }),
                },
            };

            this.logger.log(`Capturing PayPal order: ${payment_id}`);
            this.logger.debug(
                "PayPal capture request:",
                JSON.stringify(request, null, 2),
            );

            const response = await this.ordersController.captureOrder({
                id: payment_id,
                body: {},
            });

            if (response.statusCode !== 201) {
                this.logger.error(
                    "PayPal order capture failed:",
                    response.result,
                );
                throw new BadRequestException("Failed to capture PayPal order");
            }

            const order = response.result;
            const capture = order.purchaseUnits?.[0]?.payments?.captures?.[0];

            const paymentResponse: PaymentResponseDto = {
                id: order.id!,
                status: order.status as unknown as PaymentStatus,
                amount: {
                    currency_code:
                        capture?.amount?.currencyCode ||
                        amount?.currency_code ||
                        "USD",
                    value: capture?.amount?.value || amount?.value || "0",
                },
                capture_id: capture?.id,
                create_time: order.createTime,
                update_time: order.updateTime,
            };

            this.logger.log(`PayPal order captured successfully: ${order.id}`);
            return paymentResponse;
        } catch (error) {
            this.logger.error("Error capturing PayPal payment:", error);
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException("Failed to capture payment");
        }
    }

    /**
     * Get payment details
     */
    async getPayment(paymentId: string): Promise<PaymentResponseDto> {
        try {
            this.logger.log(`Getting PayPal order: ${paymentId}`);

            const response = await this.ordersController.getOrder({
                id: paymentId,
            });

            if (response.statusCode !== 200) {
                this.logger.error(
                    "PayPal order retrieval failed:",
                    response.result,
                );
                throw new BadRequestException("Failed to get PayPal order");
            }

            const order = response.result;
            const capture = order.purchaseUnits?.[0]?.payments?.captures?.[0];
            const approvalUrl = order.links?.find(
                (link) => link.rel === "approve",
            )?.href;

            const paymentResponse: PaymentResponseDto = {
                id: order.id!,
                status: order.status as unknown as PaymentStatus,
                amount: {
                    currency_code:
                        order.purchaseUnits?.[0]?.amount?.currencyCode || "USD",
                    value: order.purchaseUnits?.[0]?.amount?.value || "0",
                },
                approval_url: approvalUrl,
                capture_id: capture?.id,
                create_time: order.createTime,
                update_time: order.updateTime,
            };

            this.logger.log(
                `PayPal order retrieved successfully: ${paymentId}`,
            );
            return paymentResponse;
        } catch (error) {
            this.logger.error("Error getting PayPal payment:", error);
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException("Failed to get payment");
        }
    }

    /**
     * Refund a captured payment
     */
    async refundPayment(refundPaymentDto: RefundPaymentDto): Promise<{
        id?: string;
        status?: string;
        amount?: {
            currency_code: string;
            value: string;
        };
        create_time?: string;
        update_time?: string;
    }> {
        try {
            const { capture_id, amount, note_to_payer } = refundPaymentDto;

            this.logger.log(`Refunding PayPal capture: ${capture_id}`);

            const response =
                await this.paymentsController.refundCapturedPayment({
                    captureId: capture_id,
                    body: {
                        noteToPayer: note_to_payer,
                        ...(amount && {
                            amount: {
                                currencyCode: amount.currency_code,
                                value: amount.value,
                            },
                        }),
                    },
                });

            if (response.statusCode !== 201) {
                this.logger.error("PayPal refund failed:", response.result);
                throw new BadRequestException(
                    "Failed to refund PayPal payment",
                );
            }

            this.logger.log(
                `PayPal refund processed successfully: ${capture_id}`,
            );

            const refund = response.result;
            return {
                id: refund.id,
                status: refund.status,
                amount: refund.amount
                    ? {
                          currency_code: refund.amount.currencyCode || "USD",
                          value: refund.amount.value || "0",
                      }
                    : undefined,
                create_time: refund.createTime,
                update_time: refund.updateTime,
            };
        } catch (error) {
            this.logger.error("Error refunding PayPal payment:", error);
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException("Failed to refund payment");
        }
    }

    /**
     * Generate client token for PayPal client-side SDK
     */
    generateClientToken(): { client_token: string } {
        try {
            // For client-side PayPal SDK integration
            const clientId = this.configService.get<string>("PAYPAL_CLIENT_ID");

            if (!clientId) {
                throw new InternalServerErrorException(
                    "PayPal client ID not configured",
                );
            }

            // Return the client ID for frontend PayPal SDK initialization
            return {
                client_token: clientId,
            };
        } catch (error) {
            this.logger.error("Error generating client token:", error);
            throw new InternalServerErrorException(
                "Failed to generate client token",
            );
        }
    }

    /**
     * Verify webhook signature (for webhook endpoints)
     */
    verifyWebhookSignature(): boolean {
        try {
            // This would typically verify the webhook signature using PayPal's webhook verification
            // For now, we'll return true, but in production you should implement proper verification
            this.logger.log("Webhook signature verification called");
            return true;
        } catch (error) {
            this.logger.error("Error verifying webhook signature:", error);
            return false;
        }
    }
}
