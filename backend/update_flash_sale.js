import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from './src/models/book.model.js';

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/ebookshelf";

async function populateFlashSale() {
    try {
        console.log("Connecting to MongoDB for Flash Sale update...");
        await mongoose.connect(MONGODB_URL);
        
        console.log("Picking random books to set as Flash Sale...");
        const books = await Book.find().limit(50); // get first 50 to shuffle
        const shuffled = books.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 30); // update 30 books
        
        const now = new Date();
        const endTime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

        let updatedCount = 0;
        for (const book of selected) {
            const salePrice = Math.floor(book.price * 0.5); // 50% discount
            await Book.findByIdAndUpdate(book._id, {
                flash_sale_price: salePrice,
                flash_sale_end_time: endTime
            });
            updatedCount++;
        }

        console.log(`Success! Updated ${updatedCount} books with Flash Sale prices.`);
        process.exit(0);
    } catch (error) {
        console.error("Error updating flash sale:", error);
        process.exit(1);
    }
}

populateFlashSale();
