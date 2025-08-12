import ProductDetailsPage from "@client/components/user/product_details/page";

interface ProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const resolvedParams = await params;
    return <ProductDetailsPage params={resolvedParams} />;
}
