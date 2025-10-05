require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');

const setupDatabase = async () => {
    try {
        console.log('🚀 Starting database setup...');
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Create Admin User
        console.log('\n👑 Setting up Admin user...');
        let admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            admin = new User({
                email: 'admin@ecommerce.com',
                password: 'admin123',
                firstName: 'System',
                lastName: 'Admin',
                role: 'admin'
            });
            await admin.save();
            console.log('✅ Admin user created');
        } else {
            console.log('✅ Admin user already exists');
        }

        // Create Vendor User
        console.log('\n🏪 Setting up Vendor user...');
        let vendor = await User.findOne({ role: 'vendor' });
        if (!vendor) {
            vendor = new User({
                email: 'vendor@ecommerce.com',
                password: 'vendor123',
                firstName: 'John',
                lastName: 'Vendor',
                role: 'vendor'
            });
            await vendor.save();
            console.log('✅ Vendor user created');
        } else {
            console.log('✅ Vendor user already exists');
        }

        // Create Customer User
        console.log('\n🛍️ Setting up Customer user...');
        let customer = await User.findOne({ role: 'customer' });
        if (!customer) {
            customer = new User({
                email: 'customer@ecommerce.com',
                password: 'customer123',
                firstName: 'Jane',
                lastName: 'Customer',
                role: 'customer'
            });
            await customer.save();
            console.log('✅ Customer user created');
        } else {
            console.log('✅ Customer user already exists');
        }

        // Clear existing products
        console.log('\n📦 Setting up sample products...');
        await Product.deleteMany({});
        console.log('🗑️ Cleared existing products');

        // Sample products
        const sampleProducts = [
            {
                name: "iPhone 15 Pro",
                description: "Latest iPhone with A17 Pro chip, titanium design, and advanced camera system.",
                price: 999.99,
                category: "Electronics",
                stock: 25,
                vendor: vendor._id
            },
            {
                name: "MacBook Air M3",
                description: "Ultra-thin laptop with M3 chip, 18-hour battery life, and stunning display.",
                price: 1299.99,
                category: "Computers",
                stock: 12,
                vendor: vendor._id
            },
            {
                name: "Sony WH-1000XM5",
                description: "Industry-leading noise canceling wireless headphones with premium sound.",
                price: 399.99,
                category: "Audio",
                stock: 35,
                vendor: vendor._id
            },
            {
                name: "Nike Air Jordan 1",
                description: "Classic basketball sneakers with premium leather and iconic design.",
                price: 170.00,
                category: "Footwear",
                stock: 50,
                vendor: vendor._id
            },
            {
                name: "Levi's 501 Jeans",
                description: "Original blue jeans with straight fit and classic styling.",
                price: 89.99,
                category: "Clothing",
                stock: 75,
                vendor: vendor._id
            },
            {
                name: "KitchenAid Mixer",
                description: "Professional stand mixer with 10 speeds and multiple attachments.",
                price: 449.99,
                category: "Home & Kitchen",
                stock: 20,
                vendor: vendor._id
            },
            {
                name: "Dyson V15 Vacuum",
                description: "Cordless vacuum with laser detection and powerful suction.",
                price: 749.99,
                category: "Home & Kitchen",
                stock: 15,
                vendor: vendor._id
            },
            {
                name: "Yoga Mat Premium",
                description: "Non-slip yoga mat from eco-friendly materials with 6mm thickness.",
                price: 59.99,
                category: "Sports & Fitness",
                stock: 40,
                vendor: vendor._id
            },
            {
                name: "Instant Pot Duo",
                description: "7-in-1 pressure cooker for quick, healthy meals.",
                price: 99.99,
                category: "Home & Kitchen",
                stock: 30,
                vendor: vendor._id
            },
            {
                name: "Fitbit Charge 6",
                description: "Advanced fitness tracker with GPS and heart rate monitoring.",
                price: 159.99,
                category: "Electronics",
                stock: 60,
                vendor: vendor._id
            }
        ];

        const products = await Product.insertMany(sampleProducts);
        console.log(`✅ Added ${products.length} sample products`);

        console.log('\n🎉 Database setup complete!');
        console.log('\n📋 Test Accounts Created:');
        console.log('='.repeat(40));
        console.log('👑 Admin:');
        console.log('   📧 Email: admin@ecommerce.com');
        console.log('   🔑 Password: admin123');
        console.log('');
        console.log('🏪 Vendor:');
        console.log('   📧 Email: vendor@ecommerce.com');
        console.log('   🔑 Password: vendor123');
        console.log('');
        console.log('🛍️ Customer:');
        console.log('   📧 Email: customer@ecommerce.com');
        console.log('   🔑 Password: customer123');

        console.log('\n🧪 Ready to test APIs!');
        console.log('🌐 Open: http://localhost:5000/dashboard.html');

    } catch (error) {
        console.error('❌ Setup failed:', error.message);
    } finally {
        mongoose.connection.close();
        console.log('\n🔌 Database connection closed');
    }
};

setupDatabase();