import React from "react";
import { Navbar } from "@client/components/ui/navbar";
import ProductDetails from "./ProductDetails";
import { Footer } from "@client/components/ui/footer";

interface ProductDetailsPageProps {
    params?: {
        id?: string;
    };
}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ params }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar hideAuthButtons={true} />
            <main className="flex-grow">
                <ProductDetails productId={params?.id} />
            </main>
            <Footer />
        </div>
    );
};

export default ProductDetailsPage;
