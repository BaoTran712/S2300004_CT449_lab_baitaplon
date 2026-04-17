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

// Bảng màu đẹp cho bìa sách
const COLORS = [
    { bg: '2c3e50', fg: 'ecf0f1' }, // Đen xám xanh / Trắng
    { bg: '8e44ad', fg: 'ffffff' }, // Tím / Trắng
    { bg: '2980b9', fg: 'ffffff' }, // Xanh dương / Trắng
    { bg: '27ae60', fg: 'ffffff' }, // Xanh lá / Trắng
    { bg: 'c0392b', fg: 'ffffff' }, // Đỏ / Trắng
    { bg: 'f39c12', fg: 'ffffff' }, // Cam / Trắng
    { bg: '16a085', fg: 'ffffff' }, // Ngọc lam / Trắng
    { bg: '34495e', fg: 'ecf0f1' }, // Xám tối / Trắng
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function downloadCovers() {
    if (!fs.existsSync(COVERS_DIR)){
        fs.mkdirSync(COVERS_DIR, { recursive: true });
    }

    console.log('Đang tải sinh 8 bìa sách cố định (local)...');
    
    for (let i = 0; i < COLORS.length; i++) {
        const c = COLORS[i];
        // Dùng placehold.co để sinh ra ảnh tĩnh với chữ đẹp gọn
        const url = `https://placehold.co/400x600/${c.bg}/${c.fg}/png?text=EBookshelf\\nCover+${i+1}`;
        const dest = path.join(COVERS_DIR, `cover-${i}.png`);
        
        await new Promise((resolve, reject) => {
            const file = fs.createWriteStream(dest);
            https.get(url, (response) => {
                response.pipe(file);
                file.on('finish', () => {
                    file.close(resolve);
                });
            }).on('error', (err) => {
                fs.unlink(dest, () => {});
                reject(err);
            });
        });
        console.log(`Đã tải /covers/cover-${i}.png`);
    }
}

async function updateImages() {
    try {
        await downloadCovers();

        console.log('\nĐang kết nối MongoDB...');
        await mongoose.connect(MONGODB_URL);
        
        console.log('Kết nối thành công. Tiến hành thay máu toàn bộ sách sang link ảnh Local Cố định...');
        const books = await Book.find({});
        
        let count = 0;
        const operations = books.map(book => {
            count++;
            const randomCoverId = Math.floor(Math.random() * COLORS.length);
            return {
                updateOne: {
                    filter: { _id: book._id },
                    update: { $set: { image: `/covers/cover-${randomCoverId}.png` } }
                }
            };
        });

        if (operations.length > 0) {
            await Book.bulkWrite(operations);
        }
        
        console.log(`✅ Hoàn tất đồng bộ ảnh cứng cố định cho ${count} tựa sách! Không sợ hỏng link URL mạng nữa!`);
    } catch (err) {
        console.error('Lỗi nghiêm trọng:', err.message);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

updateImages();
