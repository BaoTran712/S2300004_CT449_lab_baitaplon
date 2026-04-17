import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
    book_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        trim: true,
    },
    reply: {
        type: String,
        default: null,
    },
    repliedAt: {
        type: Date,
        default: null,
    },
},
    {
        timestamps: true,
    }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
