import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book      from './src/models/book.model.js';
import Publisher from './src/models/publisher.model.js';
import User      from './src/models/user.model.js';
import Staff     from './src/models/staff.model.js';

dotenv.config();

// ─── Configuration ────────────────────────────────────────────────────────────
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/ebookshelf';
const BOOK_COUNT  = 1000;
const BATCH_SIZE  = 200;   // số sách insert mỗi lần để tránh tràn bộ nhớ
const YEAR_MIN    = 1990;
const YEAR_MAX    = 2024;
const PRICE_MIN   = 10;    // đơn vị: x5000đ
const PRICE_MAX   = 100;
const PRICE_STEP  = 5_000;


// ─── Static Data ─────────────────────────────────────────────────────────────
const PUBLISHERS = [
    { name: 'NXB Kim Đồng',  address: 'Hà Nội'           },
    { name: 'NXB Trẻ',       address: 'TP. Hồ Chí Minh'  },
    { name: 'NXB Giáo Dục',  address: 'Hà Nội'           },
    { name: 'NXB Phụ Nữ',    address: 'TP. Hồ Chí Minh'  },
    { name: 'NXB Tổng Hợp',  address: 'TP. Hồ Chí Minh'  },
];

const TITLES = [
    'Hành Trình', 'Bí Mật', 'Chiến Binh', 'Ánh Sáng', 'Bình Minh',
    'Giấc Mơ',   'Thành Phố', 'Ký Ức',   'Ngôi Sao', 'Đại Dương',
    'Rừng Thiêng','Cánh Cửa', 'Thời Gian','Tình Yêu', 'Bóng Tối', 'Kho Báu',
];

const SUBJECTS = [
    'của Vũ Trụ', 'của Linh Hồn', 'của Lịch Sử', 'Kỹ Thuật',   'Tương Lai',
    'Cổ Đại',     'Sáng Tạo',     'Lao Động',     'Trí Tuệ',    'Dũng Cảm',
    'Hy Vọng',    'Hòa Bình',     'Phát Triển',   'Khoa Học',
];

const AUTHORS = [
    'Nguyễn Nhật Ánh', 'Nam Cao',        'Tô Hoài',        'Xuân Diệu',
    'Thạch Lam',        'Nguyên Hồng',   'Vũ Trọng Phụng', 'Ernest Hemingway',
    'Haruki Murakami',  'J.K. Rowling',  'George Orwell',  'Mark Twain',
];

const BOOK_COVERS = [
    'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
];

const DESCRIPTIONS = [
    'Một tác phẩm kinh điển mở ra những góc nhìn mới về cuộc sống và con người. Cuốn sách giúp độc giả tìm lại sự bình yên trong tâm hồn giữa thế giới xô bồ.',
    'Khám phá những bí ẩn của vũ trụ và sức mạnh của trí tuệ con người qua những trang sách đầy cảm hứng. Một cuốn sách không thể thiếu cho những ai yêu khoa học.',
    'Hành trình đầy gian truân nhưng cũng không kém phần lãng mạn của những con người đi tìm lý tưởng sống. Một câu chuyện lay động lòng người.',
    'Bí quyết để thành công và kiến tạo một cuộc đời đáng sống. Tác giả chia sẻ những kinh nghiệm thực tế và bài học quý giá từ những người đi trước.',
    'Tuyển tập những câu chuyện ngắn đầy triết lý, nhẹ nhàng nhưng sâu sắc, mang lại những giây phút thư giãn thực sự cho bạn đọc.',
];

const PREVIEWS = [
    'Ánh sáng ban mai khẽ lọt qua khe cửa, đậu trên mái tóc của người thiếu nữ đang say giấc. Đó là khởi đầu của một hành trình không hồi kết, nơi mà những giấc mơ không còn là ảo ảnh.\n\nTôi tự hỏi liệu thời gian có thể quay ngược lại, để tôi có thể sửa chữa những sai lầm của tuổi trẻ. Nhưng gió chỉ đáp lại bằng sự im lặng mênh mông của đại dương.\n\nTrong tay tôi là chiếc chìa khóa cổ xưa — thứ được cho là có thể mở ra cánh cửa dẫn vào thế giới của các chiến binh ánh sáng...',
    'Vũ trụ bao la chứa đựng những bí ẩn mà trí tuệ con người mới chỉ chạm đến lớp vỏ bên ngoài. Sự dũng cảm không phải là không biết sợ, mà là đối mặt với nỗi sợ để tìm ra chân lý.\n\nBước chân tôi vang dội trong sảnh đường cổ đại, nơi những bức tượng đá như đang dõi theo từng cử động. Mỗi ký ức hiện về như một thước phim quay chậm...\n\nChúng ta đang đứng trước ngưỡng cửa của tương lai, nơi mà sự sáng tạo và lao động sẽ kiến tạo nên một thế giới hòa bình bền vững.',
    'Tình yêu là sức mạnh duy nhất có khả năng biến đổi kẻ thù thành bạn. Giữa bóng tối của sự tuyệt vọng, hy vọng vẫn bùng cháy như một ngôi sao đơn độc giữa bầu trời đêm.\n\nTôi đã đi qua những cánh rừng thiêng liêng nhất, lắng nghe lời thì thầm của lá và hơi thở của đất mẹ. Kho báu thực sự không phải là vàng bạc, mà là những khoảnh khắc bình yên trong tâm hồn.',
];


// ─── Utilities ────────────────────────────────────────────────────────────────
/** Chọn ngẫu nhiên một phần tử trong mảng */
const pick    = (arr) => arr[Math.floor(Math.random() * arr.length)];

/** Số nguyên ngẫu nhiên trong khoảng [min, max] */
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/** Log có prefix [SEED] */
const log     = (msg) => console.log(`[SEED] ${msg}`);


// ─── Seed Functions ───────────────────────────────────────────────────────────

/**
 * Tạo Publishers nếu chưa có.
 * @returns {Array} danh sách publisher từ DB
 */
async function seedPublishers() {
    let publishers = await Publisher.find();
    if (publishers.length > 0) {
        log(`Publishers đã tồn tại (${publishers.length}). Bỏ qua.`);
        return publishers;
    }
    publishers = await Publisher.insertMany(PUBLISHERS);
    log(`Đã tạo ${publishers.length} publishers.`);
    return publishers;
}

/**
 * Xóa toàn bộ sách cũ và tạo BOOK_COUNT sách mới theo từng batch.
 * @param {Array} publishers - danh sách publisher để gán ngẫu nhiên
 */
async function seedBooks(publishers) {
    await Book.deleteMany({});
    log('Đã xóa sách cũ.');

    const books = Array.from({ length: BOOK_COUNT }, (_, i) => ({
        title:           `${pick(TITLES)} ${pick(SUBJECTS)} ${i + 1}`,
        author:          pick(AUTHORS),
        publisher_id:    pick(publishers)._id,
        price:           randInt(PRICE_MIN, PRICE_MAX) * PRICE_STEP,
        quantity:        randInt(1, 100),
        published_year:  randInt(YEAR_MIN, YEAR_MAX),
        image:           pick(BOOK_COVERS),
        description:     pick(DESCRIPTIONS),
        preview_chapter: pick(PREVIEWS),
    }));

    for (let i = 0; i < books.length; i += BATCH_SIZE) {
        const batch = books.slice(i, i + BATCH_SIZE);
        await Book.insertMany(batch);
        log(`  Đã insert ${i + batch.length}/${BOOK_COUNT} sách.`);
    }
}

/**
 * Cập nhật avatar cho toàn bộ Users và Staff bằng bulkWrite.
 */
async function seedAvatars() {
    const [users, staffList] = await Promise.all([User.find(), Staff.find()]);

    if (users.length > 0) {
        await User.bulkWrite(
            users.map(u => ({
                updateOne: {
                    filter: { _id: u._id },
                    update: { $set: { avatar: `https://i.pravatar.cc/150?u=${u.username}` } },
                },
            }))
        );
        log(`Đã cập nhật avatar cho ${users.length} người dùng.`);
    }

    if (staffList.length > 0) {
        await Staff.bulkWrite(
            staffList.map(s => ({
                updateOne: {
                    filter: { _id: s._id },
                    update: { $set: { avatar: `https://i.pravatar.cc/150?u=${s.username}` } },
                },
            }))
        );
        log(`Đã cập nhật avatar cho ${staffList.length} nhân viên.`);
    }
}


// ─── Entry Point ──────────────────────────────────────────────────────────────
async function main() {
    try {
        log('Đang kết nối MongoDB...');
        await mongoose.connect(MONGODB_URL);
        log('Kết nối thành công.\n');

        const publishers = await seedPublishers();
        await seedBooks(publishers);
        await seedAvatars();

        const totalBooks = await Book.countDocuments();
        log(`\n✅ Hoàn tất! Tổng sách trong database: ${totalBooks}`);
    } catch (err) {
        console.error('[SEED] Lỗi nghiêm trọng:', err.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
        log('Đã đóng kết nối database.');
    }
}

main();
