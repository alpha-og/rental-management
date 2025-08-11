import { Navbar } from "@client/components/ui/navbar";
import { Hero } from "@client/components/landing/hero";
import { Footer } from "@client/components/ui/footer";

export default function LandingPage() {
    return (
        <div>
            <Navbar />
            <Hero />
            <Footer />
        </div>
    );
}
