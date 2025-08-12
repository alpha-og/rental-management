import ProductDetailsPage from "@client/components/user/product_details/page";

interface ProductPageProps {
    params: {
        id: string;
    };
}

export default function ProductPage({ params }: ProductPageProps) {
    return <ProductDetailsPage params={params} />;
}
