import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import ApiError from "../api-error.js";
import auth from "../middlewares/auth.middleware.js";

const router = express.Router();

// Thư mục cất ảnh tải lên (nằm tại backend/public/uploads)
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Thiết lập kho chứa
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Random hóa tên để không bao giờ bị đè ảnh
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Giới hạn định dạng
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new ApiError(400, "Lỗi định dạng. Vui lòng chỉ tải lên tệp tin ảnh!"), false);
    }
};

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit 10MB
    fileFilter: fileFilter
});

// Endpoint: POST /api/upload
router.post("/", auth, upload.single('image'), (req, res, next) => {
    try {
        if (!req.file) {
            return next(new ApiError(400, "Không nhận được tệp ảnh từ chặng Frontend."));
        }
        
        // Trả URL cục bộ
        const filePath = `http://localhost:3000/public/uploads/${req.file.filename}`;
        
        return res.json({
            message: "Upload ảnh bìa thành công!",
            url: filePath
        });
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "Có lỗi xảy ra trong quá trình Upload."));
    }
});

export default router;
