# Product Details Page

This component implements a product details page based on the Figma design provided. It includes all the features shown in the design mockup.

## Features

- **Product Information Display**: Shows product name, price, and pricing per unit
- **Breadcrumb Navigation**: Clickable breadcrumb showing "All Products / Product name"
- **Date Selection**: From/To date pickers for rental period
- **Quantity Selection**: +/- buttons to adjust quantity (with availability limits)
- **Price List Dropdown**: Shows different pricing tiers for different rental durations
- **Coupon Application**: Input field and apply button for discount codes
- **Product Description**: Expandable product details with "Read More" functionality
- **Terms & Conditions**: Section for rental terms
- **Social Sharing**: Share buttons for Facebook, Twitter, Instagram, and copy link
- **Add to Cart**: Prominent button to add the product to cart
- **Rating Display**: Star rating system
- **Availability Indicator**: Shows number of items available

## Files Created

- `apps/client/src/components/user/product_details/ProductDetails.tsx` - Main component
- `apps/client/src/components/user/product_details/page.tsx` - Page wrapper component
- `apps/client/src/components/user/product_details/index.ts` - Export file
- `apps/client/src/app/user/product/[id]/page.tsx` - Next.js app router page
- `apps/client/src/app/user/products/page.tsx` - Products listing page

## Navigation

The product details page is accessible via:
- `/user/product/[id]` - Individual product pages
- `/user/products` - Products listing page (updated to link to product details)

## Styling

The component uses:
- Tailwind CSS for styling (consistent with the existing codebase)
- Lucide React icons
- Responsive design that works on mobile and desktop
- Gradient styling for buttons consistent with the design system

## Integration

- Updated the existing `ProductCard` component to link to product details
- Updated the `Navbar` component to include "Rental Shop" and "Wishlist" links
- Created a products listing page to demonstrate navigation

## Usage

```tsx
import ProductDetailsPage from "@client/components/user/product_details";

// Use in a Next.js page
export default function ProductPage({ params }: { params: { id: string } }) {
    return <ProductDetailsPage params={params} />;
}
```

The component automatically handles product data based on the `productId` prop (currently uses mock data, but can be easily integrated with an API).
