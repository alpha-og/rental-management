# Backend API Endpoints for Dashboard

## Base URL
- Development: `http://localhost:3001/api/v1`
- Production: Set via `NEXT_PUBLIC_API_URL` environment variable

## Dashboard Endpoints

### 1. Dashboard Statistics
**GET** `/dashboard/stats?period={period}`

**Query Parameters:**
- `period` (optional): `last-7-days` | `last-30-days` | `last-90-days` | `last-year`
- Default: `last-30-days`

**Response:**
```json
{
  "quotations": 10,
  "rentals": 26,
  "revenue": 10599
}
```

### 2. Top Product Categories
**GET** `/dashboard/product-categories?period={period}`

**Query Parameters:**
- `period` (optional): `last-7-days` | `last-30-days` | `last-90-days` | `last-year`
- Default: `last-30-days`

**Response:**
```json
[
  {
    "category": "Rental - Service",
    "ordered": 25,
    "revenue": 2940
  }
]
```

### 3. Top Products
**GET** `/dashboard/top-products?period={period}`

**Query Parameters:**
- `period` (optional): `last-7-days` | `last-30-days` | `last-90-days` | `last-year`
- Default: `last-30-days`

**Response:**
```json
[
  {
    "product": "Wheelchairs",
    "ordered": 10,
    "revenue": 3032
  },
  {
    "product": "tables",
    "ordered": 5,
    "revenue": 1008
  },
  {
    "product": "chairs",
    "ordered": 4,
    "revenue": 3008
  }
]
```

### 4. Top Customers
**GET** `/dashboard/top-customers?period={period}`

**Query Parameters:**
- `period` (optional): `last-7-days` | `last-30-days` | `last-90-days` | `last-year`
- Default: `last-30-days`

**Response:**
```json
[
  {
    "customer": "Customer1",
    "ordered": 10,
    "revenue": 3032
  },
  {
    "customer": "Customer2",
    "ordered": 5,
    "revenue": 1008
  },
  {
    "customer": "Customer3",
    "ordered": 4,
    "revenue": 3008
  }
]
```

## Error Handling

If any endpoint is not available or returns an error, the frontend will:
1. Log a warning to the console
2. Fall back to the predefined dummy data
3. Continue to function normally

This ensures the dashboard remains functional even when the backend is not fully implemented.

## Implementation Status

- ✅ **Frontend API Layer**: Complete with error handling and fallbacks
- ⏳ **Backend Endpoints**: To be implemented
- ⏳ **Database Integration**: To be implemented
- ⏳ **Authentication**: To be implemented

## Environment Variables

Add to your `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

## Testing

Currently, the API calls will fail gracefully and use fallback data. Once the backend endpoints are implemented, the dashboard will automatically start using real data without any frontend changes needed.
