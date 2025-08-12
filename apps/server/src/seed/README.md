# Database Seeder

This directory contains the database seeding functionality for the rental management application.

## Overview

The seeder creates realistic demo data for all entities in the system:

- **Users**: Admin user and 20 demo users with hashed passwords
- **Products**: Comprehensive product catalog across all 20 categories
- **Rates**: Multiple pricing tiers (hourly, daily, weekly, monthly) for each product
- **Attachments**: Mock file attachments for products
- **Quotations**: Sample quotations linking products and rates
- **Orders**: Orders in various states (pending, confirmed, cancelled)
- **Contracts**: Contracts for confirmed orders
- **Reservations**: Product reservations linked to orders

## Features

### Realistic Data Generation
- Uses Faker.js to generate realistic names, emails, addresses, descriptions
- Category-specific product names and images
- Proper pricing relationships between different rate durations
- Realistic file metadata for attachments
- Valid date ranges for contracts and reservations

### Data Consistency
- Maintains referential integrity across all entities
- Products have appropriate rates and attachments
- Orders reference valid quotations
- Contracts only created for confirmed orders
- Reservations properly linked to products and orders

### Comprehensive Coverage
- 20+ product categories with 3-8 items each
- Multiple rate options per product
- Various order statuses and confirmation states
- Mix of valid and invalid reservations
- Attachments with realistic file metadata

## Usage

### Run the seeder
```bash
# Using pnpm
pnpm run seed

# Or using npm
npm run seed

# Development mode
pnpm run seed:dev
```

### Seeder Output
The seeder provides detailed logging:
- Progress updates for each entity type
- Count of created records
- Success/error reporting
- Summary statistics

## Database Schema Coverage

### Users Table
- `id`: UUID primary key
- `name`: Full name
- `email`: Unique email address
- `phone`: Unique phone number
- `passwordHash`: Bcrypt hashed password
- `refreshToken`: JWT refresh token (nullable)
- `createdAt`, `updatedAt`: Timestamps

### Products Table
- `id`: UUID primary key
- `name`: Product name (category-specific)
- `description`: Product description
- `price`: Base price
- `quantity`: Available quantity
- `category`: Product category (enum)
- `termsAndConditions`: Rental terms
- `imageUrl`: Product image URL
- `createdAt`, `updatedAt`: Timestamps

### Rates Table
- `id`: UUID primary key
- `productId`: Foreign key to products
- `duration`: HOURLY, DAILY, WEEKLY, MONTHLY
- `price`: Rate price
- `isExtra`: Boolean for extra services
- `createdAt`, `updatedAt`: Timestamps

### Quotations Table
- `id`: UUID primary key
- `productId`: Foreign key to products
- `rateId`: Foreign key to rates
- `quantity`: Requested quantity
- `createdAt`, `updatedAt`: Timestamps

### Orders Table
- `id`: UUID primary key
- `deliveryAddress`: Delivery address
- `status`: pending, confirmed, cancelled
- `endUserConfirmation`: Boolean
- `customerConfirmation`: Boolean
- `createdAt`, `updatedAt`: Timestamps

### Contracts Table
- `id`: UUID primary key
- `orderId`: Foreign key to orders
- `rentalPeriod`: ISO 8601 duration
- `startDate`: Contract start date
- `createdAt`, `updatedAt`: Timestamps

### Reservations Table
- `id`: UUID primary key
- `orderId`: Foreign key to orders (nullable)
- `productId`: Foreign key to products
- `isValid`: Boolean validity flag
- `createdAt`, `updatedAt`: Timestamps

### Attachments Table
- `id`: UUID primary key
- `productId`: Foreign key to products
- `appwriteFileId`: Appwrite file ID
- `fileName`: Original file name
- `mimeType`: File MIME type
- `fileSize`: File size in bytes
- `fileUrl`: Access URL
- `createdAt`, `updatedAt`: Timestamps

## Default Users

The seeder creates a default admin user:
- **Email**: admin@example.com
- **Password**: admin123

All other demo users have the password: `password123`

## Data Volumes

The seeder generates:
- 21 users (1 admin + 20 demo users)
- ~100 products across all categories
- ~300 rates (multiple per product)
- ~300-500 attachments
- 100 quotations
- 30-60 orders
- Contracts for confirmed orders
- Reservations for orders + standalone reservations

## Customization

To modify the seeder:

1. **Adjust data volumes**: Change the loop counts in each seed method
2. **Add new categories**: Update the `productCategories` array
3. **Modify price calculations**: Update the rate calculation logic
4. **Change user credentials**: Modify the admin user creation
5. **Add new entities**: Create new seed methods following the existing pattern

## Dependencies

- `@faker-js/faker`: For generating realistic test data
- `bcrypt`: For password hashing
- `sequelize-typescript`: For database models
- All NestJS modules and their respective models
