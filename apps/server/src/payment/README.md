# PayPal Payment Integration

This module provides PayPal payment gateway integration using the PayPal REST API approach.

## Setup

1. **PayPal Developer Account Setup**
   - Go to [PayPal Developer Dashboard](https://developer.paypal.com)
   - Create a sandbox business account
   - Create a REST API app
   - Get your Client ID and Client Secret

2. **Environment Configuration**
   Add the following environment variables to your `.env` file:
   ```
   PAYPAL_CLIENT_ID=your_client_id_here
   PAYPAL_CLIENT_SECRET=your_client_secret_here
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development
   ```

3. **Module Import**
   Add the PaymentModule to your main app module:
   ```typescript
   import { PaymentModule } from './payment/payment.module';

   @Module({
     imports: [
       // ... other modules
       PaymentModule,
     ],
   })
   export class AppModule {}
   ```

## API Endpoints

### 1. Create Payment
**POST** `/payment/create`

Creates a new PayPal order.

Request body:
```json
{
  "intent": "CAPTURE",
  "amount": {
    "currency_code": "USD",
    "value": "100.00"
  },
  "description": "Rental payment",
  "return_url": "http://localhost:3000/payment/success",
  "cancel_url": "http://localhost:3000/payment/cancel",
  "payer": {
    "email_address": "customer@example.com",
    "given_name": "John",
    "surname": "Doe"
  }
}
```

Response:
```json
{
  "id": "order_id",
  "status": "CREATED",
  "amount": {
    "currency_code": "USD",
    "value": "100.00"
  },
  "approval_url": "https://www.sandbox.paypal.com/checkoutnow?token=order_id",
  "create_time": "2025-01-01T00:00:00Z",
  "update_time": "2025-01-01T00:00:00Z"
}
```

### 2. Capture Payment
**POST** `/payment/capture`

Captures (completes) a PayPal order after customer approval.

Request body:
```json
{
  "payment_id": "order_id"
}
```

### 3. Get Payment Details
**GET** `/payment/:id`

Retrieves payment details by order ID.

### 4. Refund Payment
**POST** `/payment/refund`

Refunds a captured payment.

Request body:
```json
{
  "capture_id": "capture_id",
  "amount": {
    "currency_code": "USD",
    "value": "50.00"
  },
  "note_to_payer": "Partial refund"
}
```

### 5. Get Client Token
**GET** `/payment/client-token`

Returns the PayPal client ID for frontend SDK initialization.

### 6. Webhook Endpoint
**POST** `/payment/webhook`

Handles PayPal webhook notifications (configure this URL in PayPal Developer Dashboard).

### 7. Health Check
**GET** `/payment/health`

Checks PayPal integration health status.

## Usage Flow

1. **Create Payment**: Frontend calls `/payment/create` to create a PayPal order
2. **Customer Approval**: Redirect customer to the `approval_url` from step 1
3. **Capture Payment**: After customer approval, call `/payment/capture` to complete the transaction
4. **Handle Webhooks**: Configure webhook URL to receive payment notifications

## Error Handling

The service includes comprehensive error handling:
- Invalid PayPal credentials
- Network errors
- PayPal API errors
- Validation errors

## Security

- All endpoints require authentication (AuthGuard)
- Webhook signature verification (implement in production)
- Secure credential handling via environment variables

## Testing

Use PayPal's sandbox environment for testing:
- Sandbox API base URL: `https://api-m.sandbox.paypal.com`
- Test with sandbox accounts created in PayPal Developer Dashboard

## Production

For production deployment:
1. Update environment variables with live PayPal credentials
2. Set `NODE_ENV=production`
3. Configure webhook endpoints in PayPal Live environment
4. Implement proper webhook signature verification
