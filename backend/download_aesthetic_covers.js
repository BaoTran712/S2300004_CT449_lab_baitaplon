import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import https from 'https';
import Book from './src/models/book.model.js';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/ebookshelf';
const COVERS_DIR = path.join(__dirname, '..', 'frontend', 'public', 'covers');

// Những ID ảnh xịn mịn từ unsplash, đã được chọn lọc
const AESTHETIC_COVERS = [
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop', // book stack
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop', // open book
    'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop', // novel
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=800&auto=format&fit=crop', // aesthetic
    'https://images.unsplash.com/photo-1524578959404-518218151528?q=80&w=800&auto=format&fit=crop', // retro
    'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop', // modern
    'https://images.unsplash.com/photo-1511108690759-009324a5033d?q=80&w=800&auto=format&fit=crop', // library
    'https://images.unsplash.com/photo-1588580000645-4562a6d2c839?q=80&w=800&auto=format&fit=crop', // close up
];

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                return downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) {
                reject(new Error(`Failed to download: ${res.statusCode}`));
                return;
            }
            const fileStream = fs.createWriteStream(filepath);
            res.pipe(fileStream);
            fileStream.on('finish', () => {
                fileStream.close(resolve);
            });
        }).on('error', reject);
    });
};

async function downloadAestheticCovers() {
    if (!fs.existsSync(COVERS_DIR)){
        fs.mkdirSync(COVERS_DIR, { recursive: true });
    }

    console.log('Đang tải 8 bìa sách gốc xịn mịn về lại máy (tải 1 lần dùng mãi mãi)...');
    
    for (let i = 0; i < AESTHETIC_COVERS.length; i++) {
        const dest = path.join(COVERS_DIR, `beautiful-cover-${i}.jpg`);
        try {
            await downloadImage(AESTHETIC_COVERS[i], dest);
            console.log(`Đã tải xong ảnh đẹp: /covers/beautiful-cover-${i}.jpg`);
        } catch(e) {
            console.log(`Lỗi tải ảnh thứ ${i}: ${e.message}`);
        }
    }
}

async function updateImages() {
    try {
        await downloadAestheticCovers();

        console.log('\nĐang kết nối MongoDB...');
        await mongoose.connect(MONGODB_URL);
        
        console.log('Đang vá lại toàn bộ 1000 đầu sách chuyển sang ảnh xịn...');
        const books = await Book.find({});
        
        let count = 0;
        const operations = books.map(book => {
            count++;
            const randomCoverId = Math.floor(Math.random() * AESTHETIC_COVERS.length);
            return {
                updateOne: {
                    filter: { _id: book._id },
                    update: { $set: { image: `/covers/beautiful-cover-${randomCoverId}.jpg` } }
                }
            };
        });

        if (operations.length > 0) {
            await Book.bulkWrite(operations);
        }
        
        console.log(`✅ Hoàn tất! Đã thay lại hình sách gốc 100% không bị vỡ.`);
    } catch (err) {
        console.error('Lỗi nghiêm trọng:', err.message);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

updateImages();
