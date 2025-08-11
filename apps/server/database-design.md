# Database design

## Schema

### Products

| Field              | Type   | Description                         |
| ------------------ | ------ | ----------------------------------- |
| id                 | uuid   | Unique identifier                   |
| name               | string | Name of the product                 |
| description        | string | Description of the product          |
| quantity           | number | Quantity of the product             |
| price              | number | Price of the product                |
| category           | enum   | Category of the product             |
| termsAndConditions | string | Terms and conditions of the product |
| createdAt          | date   | Date of creation                    |
| updatedAt          | date   | Date of last update                 |

### Rates

| Field     | Type    | Description          |
| --------- | ------- | -------------------- |
| id        | uuid    | Unique identifier    |
| productId | uuid    | ID of the product    |
| duration  | enum    | Duration of the rate |
| price     | number  | Price of the rate    |
| isExtra   | boolean | Is extra rate        |
| createdAt | date    | Date of creation     |
| updatedAt | date    | Date of last update  |

### Attachments

| Field     | Type | Description       |
| --------- | ---- | ----------------- |
| id        | uuid | Unique identifier |
| productId | uuid | ID of the product |

### Quotations

| Field     | Type   | Description           |
| --------- | ------ | --------------------- |
| id        | uuid   | Unique identifier     |
| productId | uuid   | ID of the product     |
| rateId    | uuid   | ID of the rate        |
| quantity  | number | Quantity of the order |
| createdAt | date   | Date of creation      |
| updatedAt | date   | Date of last update   |

### Contracts

| Field        | Type     | Description                |
| ------------ | -------- | -------------------------- |
| id           | uuid     | Unique identifier          |
| quotationId  | uuid     | ID of the quotation        |
| rentalPeriod | interval | Rental period of the order |
| startDate    | date     | Start date of the rental   |

### Orders

| Field                | Type    | Description                        |
| -------------------- | ------- | ---------------------------------- |
| id                   | uuid    | Unique identifier                  |
| quotationId          | uuid    | ID of the quotation                |
| deliveryAddress      | string  | Delivery address of the order      |
| endUserConfirmation  | boolean | End user confirmation of the order |
| customerConfirmation | boolean | Customer confirmation of the order |
| createdAt            | date    | Date of creation                   |
| updatedAt            | date    | Date of last update                |

### Reservations

| Field     | Type | Description         |
| --------- | ---- | ------------------- |
| id        | uuid | Unique identifier   |
| orderId   | uuid | ID of the order     |
| isValid   | bool | Is reservation      |
| createdAt | date | Date of creation    |
| updatedAt | date | Date of last update |
