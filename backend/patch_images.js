import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from './src/models/book.model.js';

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/ebookshelf';

const BOOK_COVERS = [
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800',
    'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800',
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=800',
    'https://images.unsplash.com/photo-1524578959404-518218151528?q=80&w=800',
    'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800',
    'https://images.unsplash.com/photo-1511108690759-009324a5033d?q=80&w=800',
    'https://images.unsplash.com/photo-1588580000645-4562a6d2c839?q=80&w=800',
    'https://images.unsplash.com/photo-1629851658428-a25e2e8e97dd?q=80&w=800',
    'https://images.unsplash.com/photo-1604866830893-c13cafa07b92?q=80&w=800'
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function updateImages() {
    try {
        console.log('Đang kết nối MongoDB...');
        await mongoose.connect(MONGODB_URL);
        
        console.log('Kết nối thành công. Đang tiến hành cập nhật ảnh cho tất cả sách...');
        const books = await Book.find({});
        
        let count = 0;
        const operations = books.map(book => {
            count++;
            return {
                updateOne: {
                    filter: { _id: book._id },
                    update: { $set: { image: pick(BOOK_COVERS) } }
                }
            };
        });

        if (operations.length > 0) {
            await Book.bulkWrite(operations);
        }
        
        console.log(`✅ Hoàn tất sửa lỗi ảnh cho ${count} tựa sách!`);
    } catch (err) {
        console.error('Lỗi nghiêm trọng:', err.message);
    } finally {
        await mongoose.disconnect();
        console.log('Đã đóng kết nối database.');
        process.exit();
    }
}

updateImages();
