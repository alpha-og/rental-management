import React from "react";
import { Navbar } from "@client/components/ui/navbar";
import CartDisplay from "./CartDisplay";
import { Footer } from "@client/components/ui/footer";

const CartPage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar hideAuth={true} />
            <main className="flex-grow">
                <CartDisplay />
            </main>
            <Footer />
        </div>
    );
};

export default CartPage;
