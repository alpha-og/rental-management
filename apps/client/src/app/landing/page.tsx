import { Navbar } from "@client/components/ui/navbar";

export default function LandingPage() {
    return (
        <div>
            <Navbar />
            <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold">
                    Welcome to Rental Management
                </h1>
                <p className="mt-4 text-lg text-gray-600">
                    Your one-stop solution for managing rental properties.
                </p>
            </main>
        </div>
    );
}
