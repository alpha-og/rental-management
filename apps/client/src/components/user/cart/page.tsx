import React from "react";
import { Navbar } from "@client/components/ui/navbar";
import CartDisplay from "./CartDisplay";
import { WhiteFooter } from "@client/components/ui/white-footer";

const CartPage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar hideAuth={true} />
            <main className="flex-grow">
                <CartDisplay />
            </main>
            <WhiteFooter />
        </div>
    );
};

export default CartPage;
