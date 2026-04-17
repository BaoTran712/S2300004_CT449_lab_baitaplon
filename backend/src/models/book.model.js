import mongoose from "mongoose";

const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    published_year: {
        type: Number,
        required: true,
    },
    publisher_id: {
        type: mongoose.Schema.ObjectId,
        ref: "Publisher",
    },
    author: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: null,
    },
    description: {
        type: String,
        default: "Chưa có mô tả cho cuốn sách này.",
    },
    flash_sale_price: {
        type: Number,
        default: null,
    },
    flash_sale_end_time: {
        type: Date,
        default: null,
    },
    preview_chapter: {
        type: String,
        default: null,
    },
},
    {
        timestamps: true,
    }
);

const Book = mongoose.model("Book", bookSchema);
export default Book;