require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');

const sampleProducts = [
    {
        name: "iPhone 15 Pro",
        description: "Latest iPhone with A17 Pro chip, titanium design, and advanced camera system. Perfect for photography enthusiasts and power users.",
        price: 999.99,
        category: "Electronics",
        stock: 25
    },
    {
        name: "Samsung Galaxy S24 Ultra",
        description: "Premium Android smartphone with S Pen, 200MP camera, and AI-powered features. Ideal for productivity and creativity.",
        price: 1199.99,
        category: "Electronics",
        stock: 18
    },
    {
        name: "MacBook Air M3",
        description: "Ultra-thin laptop with M3 chip, 18-hour battery life, and stunning Liquid Retina display. Perfect for students and professionals.",
        price: 1299.99,
        category: "Computers",
        stock: 12
    },
    {
        name: "Sony WH-1000XM5 Headphones",
        description: "Industry-leading noise canceling wireless headphones with 30-hour battery life and premium sound quality.",
        price: 399.99,
        category: "Audio",
        stock: 35
    },
    {
        name: "Nike Air Jordan 1 Retro",
        description: "Classic basketball sneakers with premium leather construction and iconic design. A timeless addition to any wardrobe.",
        price: 170.00,
        category: "Footwear",
        stock: 50
    },
    {
        name: "Levi's 501 Original Jeans",
        description: "The original blue jeans with a straight fit and classic styling. Made from 100% cotton denim for durability and comfort.",
        price: 89.99,
        category: "Clothing",
        stock: 75
    },
    {
        name: "KitchenAid Stand Mixer",
        description: "Professional-grade stand mixer with 10 speeds and multiple attachments. Perfect for baking enthusiasts and home chefs.",
        price: 449.99,
        category: "Home & Kitchen",
        stock: 20
    },
    {
        name: "Dyson V15 Detect Vacuum",
        description: "Cordless vacuum with laser dust detection and powerful suction. Advanced filtration system captures 99.99% of particles.",
        price: 749.99,
        category: "Home & Kitchen",
        stock: 15
    },
    {
        name: "The Great Gatsby - Hardcover",
        description: "Classic American novel by F. Scott Fitzgerald. Beautiful hardcover edition with gold foil stamping and ribbon bookmark.",
        price: 24.99,
        category: "Books",
        stock: 100
    },
    {
        name: "Yoga Mat Premium",
        description: "Non-slip yoga mat made from eco-friendly materials. 6mm thickness provides perfect cushioning for all yoga practices.",
        price: 59.99,
        category: "Sports & Fitness",
        stock: 40
    },
    {
        name: "Instant Pot Duo 7-in-1",
        description: "Multi-functional pressure cooker that replaces 7 kitchen appliances. Perfect for quick, healthy meals for busy families.",
        price: 99.99,
        category: "Home & Kitchen",
        stock: 30
    },
    {
        name: "Adidas Ultraboost 22",
        description: "High-performance running shoes with responsive Boost midsole and Primeknit upper for ultimate comfort and energy return.",
        price: 190.00,
        category: "Footwear",
        stock: 45
    },
    {
        name: "Canon EOS R6 Mark II",
        description: "Full-frame mirrorless camera with 24.2MP sensor, 4K video recording, and advanced autofocus system for professional photography.",
        price: 2499.99,
        category: "Electronics",
        stock: 8
    },
    {
        name: "Patagonia Down Jacket",
        description: "Lightweight, packable down jacket with 800-fill-power down insulation. Perfect for outdoor adventures and cold weather.",
        price: 299.99,
        category: "Clothing",
        stock: 25
    },
    {
        name: "Fitbit Charge 6",
        description: "Advanced fitness tracker with built-in GPS, heart rate monitoring, and 7-day battery life. Track your health and fitness goals.",
        price: 159.99,
        category: "Electronics",
        stock: 60
    }
];

const addSampleProducts = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Find or create a vendor user
        let vendor = await User.findOne({ role: 'vendor' });

        if (!vendor) {
            console.log('👤 No vendor found, creating sample vendor...');
            vendor = new User({
                email: 'vendor@ecommerce.com',
                password: 'vendor123',
                firstName: 'Sample',
                lastName: 'Vendor',
                role: 'vendor'
            });
            await vendor.save();
            console.log('✅ Sample vendor created');
            console.log('📧 Email: vendor@ecommerce.com');
            console.log('🔑 Password: vendor123');
        } else {
            console.log('✅ Using existing vendor:', vendor.email);
        }

        // Check if products already exist
        const existingProducts = await Product.countDocuments();
        if (existingProducts > 0) {
            console.log(`⚠️  Found ${existingProducts} existing products`);
            console.log('🗑️  Clearing existing products...');
            await Product.deleteMany({});
        }

        // Add sample products
        console.log('📦 Adding sample products...');
        const productsWithVendor = sampleProducts.map(product => ({
            ...product,
            vendor: vendor._id
        }));

        const createdProducts = await Product.insertMany(productsWithVendor);

        console.log(`✅ Successfully added ${createdProducts.length} sample products!`);
        console.log('\n📋 Sample Products Added:');
        console.log('='.repeat(50));

        createdProducts.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name}`);
            console.log(`   💰 Price: $${product.price}`);
            console.log(`   📦 Stock: ${product.stock}`);
            console.log(`   🏷️  Category: ${product.category}`);
            console.log('');
        });

        console.log('🎉 Sample data setup complete!');
        console.log('\n🧪 You can now test the following APIs:');
        console.log('• GET /vendor/products (login as vendor)');
        console.log('• GET /customer/products (login as customer)');
        console.log('• GET /customer/products/:id');
        console.log('• PUT /vendor/products/:id');
        console.log('• DELETE /vendor/products/:id');

    } catch (error) {
        console.error('❌ Error adding sample products:', error.message);
    } finally {
        mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
};

addSampleProducts();