import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from './src/models/book.model.js';
import Publisher from './src/models/publisher.model.js';
import User from './src/models/user.model.js';
import Staff from './src/models/staff.model.js';

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/ebookshelf";

const titles = [
    "Hành trình", "Bí mật", "Chiến binh", "Ánh sáng", "Bình minh", "Giấc mơ", "Thành phố", "Ký ức",
    "Ngôi sao", "Đại dương", "Rừng thiêng", "Cánh cửa", "Thời gian", "Tình yêu", "Bóng tối", "Kho báu"
];
const subjects = [
    "Vũ trụ", "Linh hồn", "Lịch sử", "Kỹ thuật", "Tương lai", "Cổ đại", "Sáng tạo", "Lao động",
    "Trí tuệ", "Dũng cảm", "Hy vọng", "Hòa bình", "Phát triển", "Khoa học"
];
const authors = [
    "Nguyễn Nhật Ánh", "Nam Cao", "Tô Hoài", "Xuân Diệu", "Thạch Lam", "Nguyên Hồng", "Vũ Trọng Phụng",
    "Ernest Hemingway", "Haruki Murakami", "J.K. Rowling", "George Orwell", "Mark Twain"
];

const bookCovers = [
    "https://images.unsplash.com/photo-1544947950-fa07b98d237f?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1511108690759-33519131016d?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1629161205631-011246996dcd?auto=format&fit=crop&q=80&w=800"
];

const bookDescriptions = [
    "Một tác phẩm kinh điển mở ra những góc nhìn mới về cuộc sống và con người. Cuốn sách giúp độc giả tìm lại sự bình yên trong tâm hồn giữa thế giới xô bồ.",
    "Khám phá những bí ẩn của vũ trụ và sức mạnh của trí tuệ con người qua những trang sách đầy cảm hứng. Một cuốn sách không thể thiếu cho những ai yêu khoa học.",
    "Hành trình đầy gian truân nhưng cũng không kém phần lãng mạn của những con người đi tìm lý tưởng sống. Một câu chuyện lay động lòng người.",
    "Bí quyết để thành công và kiến tạo một cuộc đời đáng sống. Tác giả chia sẻ những kinh nghiệm thực tế và bài học quý giá từ những người đi trước.",
    "Tuyển tập những câu chuyện ngắn đầy triết lý, nhẹ nhàng nhưng sâu sắc, mang lại những giây phút thư giãn thực sự cho bạn đọc."
];
const bookPreviews = [
    "Ánh sáng ban mai khẽ lọt qua khe cửa, đậu trên mái tóc của người thiếu nữ đang say giấc. Đó là khởi đầu của một hành trình không hồi kết, nơi mà những giấc mơ không còn là ảo ảnh. \n\nTôi tự hỏi liệu thời gian có thể quay ngược lại, để tôi có thể sửa chữa những sai lầm của tuổi trẻ. Nhưng gió chỉ đáp lại bằng sự im lặng mênh mông của đại dương. \n\nTrong tay tôi là chiếc chìa khóa cổ xưa, thứ được cho là có thể mở ra cánh cửa dẫn vào thế giới của các chiến binh ánh sáng. Mùi gỗ mục và bụi bặm hàng thế kỷ xộc vào mũi, nhưng niềm phấn khích thì không hề giảm sút...",
    "Vũ trụ bao la chứa đựng những bí ẩn mà trí tuệ con người mới chỉ chạm đến lớp vỏ bên ngoài. Sự dũng cảm không phải là không biết sợ, mà là đối mặt với nỗi sợ để tìm ra chân lý lịch sử. \n\nBước chân tôi vang dội trong sảnh đường cổ đại, nơi những bức tượng đá như đang dõi theo từng cử động. Mỗi ký ức hiện về như một thước phim quay chậm, tái hiện lại những trang kỹ thuật đỉnh cao của một nền văn minh đã mất. \n\nChúng ta đang đứng trước ngưỡng cửa của tương lai, nơi mà sự sáng tạo và lao động sẽ kiến tạo nên một thế giới hòa bình và phát triển bền vững.",
    "Tình yêu là sức mạnh duy nhất có khả năng biến đổi kẻ thù thành bạn. Giữa bóng tối của sự tuyệt vọng, hy vọng vẫn bùng cháy như một ngôi sao đơn độc giữa bầu trời đêm. \n\nTôi đã đi qua những cánh rừng thiêng liêng nhất, lắng nghe lời thì thầm của lá và hơi thở của đất mẹ. Kho báu thực sự không phải là vàng bạc, mà là những khoảnh khắc bình yên trong tâm hồn. \n\nCâu chuyện này kể về một linh hồn đi tìm bản ngã giữa vòng xoáy của thời gian, nơi mỗi quyết định đều để lại dấu ấn không thể phai mờ trong dòng sông lịch sử."
];

async function seedData() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URL);
        console.log("Connected successfully!");

        // 1. Ensure we have Publishers
        let publishers = await Publisher.find();
        if (publishers.length === 0) {
            console.log("No publishers found. Creating default ones...");
            publishers = await Publisher.insertMany([
                { name: "NXB Kim Đồng", address: "Hà Nội" },
                { name: "NXB Trẻ", address: "TP. Hồ Chí Minh" },
                { name: "NXB Giáo Dục", address: "Hà Nội" },
                { name: "NXB Phụ Nữ", address: "TP. Hồ Chí Minh" },
                { name: "NXB Tổng Hợp", address: "TP. Hồ Chí Minh" }
            ]);
            console.log("5 Publishers created.");
        }

        // 2. Clear existing books to apply new structure
        console.log("Clearing old books to apply rich content...");
        await Book.deleteMany({});
        
        console.log("Generating 1000 books with rich content...");
        const booksBatch = [];
        for (let i = 1; i <= 1000; i++) {
            const randomTitle = `${titles[Math.floor(Math.random() * titles.length)]} ${subjects[Math.floor(Math.random() * subjects.length)]} ${i}`;
            const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
            const randomPublisher = publishers[Math.floor(Math.random() * publishers.length)]._id;
            const randomPrice = Math.floor(Math.random() * (100 - 10 + 1) + 10) * 5000;
            const randomQuantity = Math.floor(Math.random() * 100) + 1;
            const randomYear = Math.floor(Math.random() * (2024 - 1990 + 1)) + 1990;
            const randomImage = bookCovers[Math.floor(Math.random() * bookCovers.length)];
            const randomDesc = bookDescriptions[Math.floor(Math.random() * bookDescriptions.length)];
            const randomPreview = bookPreviews[Math.floor(Math.random() * bookPreviews.length)];

            booksBatch.push({
                title: randomTitle,
                author: randomAuthor,
                publisher_id: randomPublisher,
                price: randomPrice,
                quantity: randomQuantity,
                published_year: randomYear,
                image: randomImage,
                description: randomDesc,
                preview_chapter: randomPreview
            });
        }

        console.log("Inserting enriched data (this may take a few seconds)...");
        await Book.insertMany(booksBatch);

        // 3. Update Existing Users/Staff with avatars
        console.log("Updating Users and Staff with avatars...");
        const users = await User.find();
        for (const user of users) {
             const randomAvatar = `https://i.pravatar.cc/150?u=${user.username}`;
             await User.updateOne({ _id: user._id }, { $set: { avatar: randomAvatar } });
        }

        const staffList = await Staff.find();
        for (const staff of staffList) {
             const randomAvatar = `https://i.pravatar.cc/150?u=${staff.username}`;
             await Staff.updateOne({ _id: staff._id }, { $set: { avatar: randomAvatar } });
        }

        const bookCount = await Book.countDocuments();
        console.log(`Success! Total books: ${bookCount}, Users updated: ${users.length}, Staff updated: ${staffList.length}`);
        
        process.exit(0);
    } catch (error) {
        console.error("Error during seeding:", error);
        process.exit(1);
    }
}

seedData();
