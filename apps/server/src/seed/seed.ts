import { faker } from "@faker-js/faker";
import * as bcrypt from "bcrypt";
import { User } from "../user/user.model";
import { Product } from "../products/products.model";
import { Rate, RateDuration } from "../rates/rate.model";
import { Quotation } from "../quotations/quotation.model";
import { Order } from "../orders/order.model";
import { Contract } from "../contracts/contract.model";
import { Reservation } from "../reservations/reservation.model";
import { Attachment } from "../attachments/attachment.model";

// Type definitions for seed data
interface UserSeedData {
    name: string;
    email: string;
    phone: string;
    passwordHash: string;
}

interface ProductSeedData {
    name: string;
    description: string;
    price: number;
    quantity: number;
    category: string;
    termsAndConditions: string;
    imageUrl: string;
}

interface RateSeedData {
    productId: string;
    duration: RateDuration;
    price: number;
    isExtra: boolean;
}

interface AttachmentSeedData {
    productId: string;
    appwriteFileId: string;
    fileName: string;
    mimeType: string;
    fileSize: number;
    fileUrl: string;
}

interface QuotationSeedData {
    productId: string;
    rateId: string;
    quantity: number;
}

interface OrderSeedData {
    deliveryAddress: string;
    status: "pending" | "confirmed" | "cancelled";
    endUserConfirmation: boolean;
    customerConfirmation: boolean;
}

interface ContractSeedData {
    orderId: string;
    rentalPeriod: string;
    startDate: Date;
}

interface ReservationSeedData {
    orderId?: string | null;
    productId: string;
    isValid: boolean;
}

// Product categories from the model
const productCategories = [
    "Vehicles & Transportation",
    "Tools & Equipment",
    "Electronics & Gadgets",
    "Home Appliances",
    "Furniture",
    "Party & Event Supplies",
    "Clothing & Costumes",
    "Sports & Outdoor Gear",
    "Musical Instruments",
    "Cameras & Photography Gear",
    "Books & Media",
    "Real Estate & Spaces",
    "Art & Decor",
    "Health & Fitness Equipment",
    "Kids & Baby Items",
    "Gardening & Landscaping Tools",
    "Watercraft & Boats",
    "Luxury Items & Collectibles",
    "Pet Supplies",
    "Specialty & Niche Items",
];

// Order status options
const orderStatuses = ["pending", "confirmed", "cancelled"] as const;

// Common image URLs for different categories
const getCategoryImage = (category: string): string => {
    const imageMap: Record<string, string> = {
        "Vehicles & Transportation":
            "https://images.unsplash.com/photo-1549399810-25bcba1b4574?w=400",
        "Tools & Equipment":
            "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400",
        "Electronics & Gadgets":
            "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400",
        "Home Appliances":
            "https://images.unsplash.com/photo-1556909012-f382c5e9c9bc?w=400",
        Furniture:
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
        "Party & Event Supplies":
            "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400",
        "Clothing & Costumes":
            "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400",
        "Sports & Outdoor Gear":
            "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400",
        "Musical Instruments":
            "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
        "Cameras & Photography Gear":
            "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400",
        "Books & Media":
            "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
        "Real Estate & Spaces":
            "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400",
        "Art & Decor":
            "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400",
        "Health & Fitness Equipment":
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        "Kids & Baby Items":
            "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400",
        "Gardening & Landscaping Tools":
            "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
        "Watercraft & Boats":
            "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400",
        "Luxury Items & Collectibles":
            "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
        "Pet Supplies":
            "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400",
        "Specialty & Niche Items":
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
    };
    return (
        imageMap[category] ||
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400"
    );
};

// Generate product name based on category
const getProductName = (category: string): string => {
    const productsByCategory: Record<string, string[]> = {
        "Vehicles & Transportation": [
            "Luxury Sedan",
            "SUV",
            "Motorcycle",
            "Electric Scooter",
            "Bicycle",
            "Van",
            "Truck",
            "ATV",
            "Golf Cart",
            "Sports Car",
        ],
        "Tools & Equipment": [
            "Power Drill",
            "Circular Saw",
            "Welding Machine",
            "Generator",
            "Pressure Washer",
            "Air Compressor",
            "Chainsaw",
            "Angle Grinder",
            "Table Saw",
            "Concrete Mixer",
        ],
        "Electronics & Gadgets": [
            "Gaming Console",
            "Smart TV",
            "Laptop",
            "Tablet",
            "Drone",
            "VR Headset",
            "Speaker System",
            "Projector",
            "Smart Watch",
            "Camera",
        ],
        "Home Appliances": [
            "Refrigerator",
            "Washing Machine",
            "Dishwasher",
            "Microwave",
            "Air Conditioner",
            "Vacuum Cleaner",
            "Coffee Machine",
            "Blender",
            "Food Processor",
            "Steam Cleaner",
        ],
        Furniture: [
            "Dining Table",
            "Sofa Set",
            "Office Chair",
            "Bed Frame",
            "Wardrobe",
            "Bookshelf",
            "TV Stand",
            "Coffee Table",
            "Desk",
            "Recliner",
        ],
        "Party & Event Supplies": [
            "Sound System",
            "LED Lights",
            "Photo Booth",
            "Tent",
            "Tables & Chairs",
            "DJ Equipment",
            "Karaoke Machine",
            "Backdrop",
            "Dance Floor",
            "Fog Machine",
        ],
        "Clothing & Costumes": [
            "Wedding Dress",
            "Tuxedo",
            "Halloween Costume",
            "Medieval Armor",
            "Formal Suit",
            "Party Dress",
            "Cosplay Outfit",
            "Traditional Wear",
            "Designer Gown",
            "Vintage Costume",
        ],
        "Sports & Outdoor Gear": [
            "Camping Tent",
            "Kayak",
            "Mountain Bike",
            "Ski Equipment",
            "Surfboard",
            "Climbing Gear",
            "Golf Set",
            "Fishing Equipment",
            "Hiking Gear",
            "Exercise Equipment",
        ],
        "Musical Instruments": [
            "Electric Guitar",
            "Piano",
            "Drum Set",
            "Violin",
            "Saxophone",
            "Keyboard",
            "Bass Guitar",
            "Trumpet",
            "Flute",
            "DJ Mixer",
        ],
        "Cameras & Photography Gear": [
            "Professional Camera",
            "Lens Kit",
            "Tripod",
            "Studio Lights",
            "Video Camera",
            "Photo Backdrop",
            "Drone Camera",
            "Film Camera",
            "Action Camera",
            "Photography Umbrella",
        ],
    };

    const items = productsByCategory[category] || ["Generic Item"];
    return faker.helpers.arrayElement(items);
};

// Generate rental period strings
const generateRentalPeriod = (): string => {
    const periods = ["P1D", "P3D", "P1W", "P2W", "P1M", "P3M", "P6M", "P1Y"];
    return faker.helpers.arrayElement(periods);
};

// Generate terms and conditions
const generateTermsAndConditions = (): string => {
    const terms = [
        "1. Item must be returned in original condition\n2. Late returns incur additional charges\n3. Damage fees apply for any damage beyond normal wear\n4. Security deposit required\n5. Renter is responsible for theft or loss",
        "1. 24-hour rental period unless otherwise specified\n2. No smoking or pets allowed with item\n3. Professional cleaning required before return\n4. Cancellation must be made 48 hours in advance\n5. Full payment due at time of booking",
        "1. Valid ID and credit card required\n2. Item inspection required before and after rental\n3. Replacement cost charged for missing accessories\n4. No subletting or transfer of rental\n5. Renter assumes all liability during rental period",
        "1. Minimum age requirement: 18 years\n2. Insurance coverage recommended\n3. Item must remain at specified location unless approved\n4. Technical support available during business hours\n5. Emergency contact information required",
    ];
    return faker.helpers.arrayElement(terms);
};

export class DatabaseSeeder {
    private users: User[] = [];
    private products: Product[] = [];
    private rates: Rate[] = [];
    private quotations: Quotation[] = [];
    private orders: Order[] = [];
    private contracts: Contract[] = [];
    private reservations: Reservation[] = [];
    private attachments: Attachment[] = [];

    async seed(): Promise<void> {
        console.log("🌱 Starting database seeding...");

        try {
            // Clear existing data
            await this.clearDatabase();

            // Seed in order of dependencies
            await this.seedUsers();
            await this.seedProducts();
            await this.seedRates();
            await this.seedAttachments();
            await this.seedQuotations();
            await this.seedOrders();
            await this.seedContracts();
            await this.seedReservations();

            console.log("✅ Database seeding completed successfully!");
            console.log(`📊 Seeded data summary:
- Users: ${this.users.length}
- Products: ${this.products.length}
- Rates: ${this.rates.length}
- Attachments: ${this.attachments.length}
- Quotations: ${this.quotations.length}
- Orders: ${this.orders.length}
- Contracts: ${this.contracts.length}
- Reservations: ${this.reservations.length}`);
        } catch (error) {
            console.error("❌ Error seeding database:", error);
            throw error;
        }
    }

    private async clearDatabase(): Promise<void> {
        console.log("🧹 Clearing existing data...");

        // Clear in reverse order of dependencies
        await Reservation.destroy({ where: {}, truncate: true, cascade: true });
        await Contract.destroy({ where: {}, truncate: true, cascade: true });
        await Order.destroy({ where: {}, truncate: true, cascade: true });
        await Quotation.destroy({ where: {}, truncate: true, cascade: true });
        await Attachment.destroy({ where: {}, truncate: true, cascade: true });
        await Rate.destroy({ where: {}, truncate: true, cascade: true });
        await Product.destroy({ where: {}, truncate: true, cascade: true });
        await User.destroy({ where: {}, truncate: true, cascade: true });
    }

    private async seedUsers(): Promise<void> {
        console.log("👥 Seeding users...");

        const userData: UserSeedData[] = [];

        // Create admin user
        userData.push({
            name: "Admin User",
            email: "admin@example.com",
            phone: "+1234567890",
            passwordHash: await bcrypt.hash("admin123", 10),
        });

        // Create demo users
        for (let i = 0; i < 20; i++) {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            userData.push({
                name: `${firstName} ${lastName}`,
                email: faker.internet
                    .email({ firstName, lastName })
                    .toLowerCase(),
                phone: faker.phone.number({ style: "international" }),
                passwordHash: await bcrypt.hash("password123", 10),
            });
        }

        this.users = await User.bulkCreate(userData);
        console.log(`✅ Created ${this.users.length} users`);
    }

    private async seedProducts(): Promise<void> {
        console.log("📦 Seeding products...");

        const productData: ProductSeedData[] = [];

        // Create products for each category
        for (const category of productCategories) {
            const itemsInCategory = faker.number.int({ min: 3, max: 8 });

            for (let i = 0; i < itemsInCategory; i++) {
                productData.push({
                    name: getProductName(category),
                    description: faker.commerce.productDescription(),
                    price: parseFloat(
                        faker.commerce.price({ min: 10, max: 5000, dec: 2 }),
                    ),
                    quantity: faker.number.int({ min: 1, max: 50 }),
                    category: category,
                    termsAndConditions: generateTermsAndConditions(),
                    imageUrl: getCategoryImage(category),
                });
            }
        }

        this.products = await Product.bulkCreate(productData);
        console.log(`✅ Created ${this.products.length} products`);
    }

    private async seedRates(): Promise<void> {
        console.log("💰 Seeding rates...");

        const rateData: RateSeedData[] = [];

        for (const product of this.products) {
            // Create multiple rate options for each product
            const rateDurations = [
                RateDuration.HOURLY,
                RateDuration.DAILY,
                RateDuration.WEEKLY,
                RateDuration.MONTHLY,
            ];
            const numRates = faker.number.int({ min: 2, max: 4 });
            const selectedDurations = faker.helpers.arrayElements(
                rateDurations,
                numRates,
            );

            for (const duration of selectedDurations) {
                const basePrice = product.price;
                let price: number;

                // Calculate price based on duration
                switch (duration) {
                    case RateDuration.HOURLY:
                        price = basePrice * 0.05; // 5% of product price per hour
                        break;
                    case RateDuration.DAILY:
                        price = basePrice * 0.15; // 15% of product price per day
                        break;
                    case RateDuration.WEEKLY:
                        price = basePrice * 0.75; // 75% of product price per week
                        break;
                    case RateDuration.MONTHLY:
                        price = basePrice * 2.5; // 250% of product price per month
                        break;
                    default:
                        price = basePrice * 0.15;
                }

                rateData.push({
                    productId: product.id,
                    duration: duration,
                    price: Math.round(price * 100) / 100, // Round to 2 decimal places
                    isExtra: faker.datatype.boolean({ probability: 0.2 }), // 20% chance of being extra
                });
            }

            // Add some extra services/fees
            if (faker.datatype.boolean({ probability: 0.3 })) {
                rateData.push({
                    productId: product.id,
                    duration: RateDuration.DAILY,
                    price: faker.number.float({
                        min: 10,
                        max: 100,
                        fractionDigits: 2,
                    }),
                    isExtra: true,
                });
            }
        }

        this.rates = await Rate.bulkCreate(rateData);
        console.log(`✅ Created ${this.rates.length} rates`);
    }

    private async seedAttachments(): Promise<void> {
        console.log("📎 Seeding attachments...");

        const attachmentData: AttachmentSeedData[] = [];

        for (const product of this.products) {
            const numAttachments = faker.number.int({ min: 1, max: 5 });

            for (let i = 0; i < numAttachments; i++) {
                const fileName = `${faker.system.fileName({ extensionCount: 1 })}.jpg`;
                const fileSize = faker.number.int({ min: 50000, max: 5000000 }); // 50KB to 5MB

                attachmentData.push({
                    productId: product.id,
                    appwriteFileId: faker.string.alphanumeric(24),
                    fileName: fileName,
                    mimeType: "image/jpeg",
                    fileSize: fileSize,
                    fileUrl: `https://cloud.appwrite.io/v1/storage/buckets/images/files/${faker.string.alphanumeric(24)}/view`,
                });
            }
        }

        this.attachments = await Attachment.bulkCreate(attachmentData);
        console.log(`✅ Created ${this.attachments.length} attachments`);
    }

    private async seedQuotations(): Promise<void> {
        console.log("📋 Seeding quotations...");

        const quotationData: QuotationSeedData[] = [];

        for (let i = 0; i < 100; i++) {
            const product = faker.helpers.arrayElement(this.products);
            const productRates = this.rates.filter(
                (rate) => rate.productId === product.id && !rate.isExtra,
            );

            if (productRates.length > 0) {
                const rate = faker.helpers.arrayElement(productRates);

                quotationData.push({
                    productId: product.id,
                    rateId: rate.id,
                    quantity: faker.number.int({
                        min: 1,
                        max: Math.min(product.quantity, 10),
                    }),
                });
            }
        }

        this.quotations = await Quotation.bulkCreate(quotationData);
        console.log(`✅ Created ${this.quotations.length} quotations`);
    }

    private async seedOrders(): Promise<void> {
        console.log("🛒 Seeding orders...");

        const orderData: OrderSeedData[] = [];

        // Create orders for some quotations
        const quotationsForOrders = faker.helpers.arrayElements(
            this.quotations,
            faker.number.int({ min: 30, max: 60 }),
        );

        for (let i = 0; i < quotationsForOrders.length; i++) {
            orderData.push({
                deliveryAddress: faker.location.streetAddress({
                    useFullAddress: true,
                }),
                status: faker.helpers.arrayElement(orderStatuses),
                endUserConfirmation: faker.datatype.boolean({
                    probability: 0.7,
                }),
                customerConfirmation: faker.datatype.boolean({
                    probability: 0.8,
                }),
            });
        }

        this.orders = await Order.bulkCreate(orderData);
        console.log(`✅ Created ${this.orders.length} orders`);
    }

    private async seedContracts(): Promise<void> {
        console.log("📄 Seeding contracts...");

        const contractData: ContractSeedData[] = [];

        // Create contracts for confirmed orders
        const confirmedOrders = this.orders.filter(
            (order) =>
                order.status === "confirmed" &&
                order.endUserConfirmation &&
                order.customerConfirmation,
        );

        for (const order of confirmedOrders) {
            const startDate = faker.date.future({ years: 1 });

            contractData.push({
                orderId: order.id,
                rentalPeriod: generateRentalPeriod(),
                startDate: startDate,
            });
        }

        this.contracts = await Contract.bulkCreate(contractData);
        console.log(`✅ Created ${this.contracts.length} contracts`);
    }

    private async seedReservations(): Promise<void> {
        console.log("🔒 Seeding reservations...");

        const reservationData: ReservationSeedData[] = [];

        // Create reservations for orders and some additional ones
        for (const order of this.orders) {
            // Get a random quotation for this reservation (simulating the relationship)
            const quotation = faker.helpers.arrayElement(this.quotations);

            reservationData.push({
                orderId: order.id,
                productId: quotation.productId,
                isValid: faker.datatype.boolean({ probability: 0.9 }),
            });
        }

        // Add some standalone reservations
        for (let i = 0; i < 20; i++) {
            const product = faker.helpers.arrayElement(this.products);

            reservationData.push({
                orderId: null, // Some reservations might not have orders yet
                productId: product.id,
                isValid: faker.datatype.boolean({ probability: 0.85 }),
            });
        }

        this.reservations = await Reservation.bulkCreate(reservationData);
        console.log(`✅ Created ${this.reservations.length} reservations`);
    }
}

// Export the seeder function
export async function runSeeder(): Promise<void> {
    const seeder = new DatabaseSeeder();
    await seeder.seed();
}

// Allow running this file directly
if (require.main === module) {
    runSeeder()
        .then(() => {
            console.log("🎉 Seeding completed successfully!");
            process.exit(0);
        })
        .catch((error) => {
            console.error("💥 Seeding failed:", error);
            process.exit(1);
        });
}
