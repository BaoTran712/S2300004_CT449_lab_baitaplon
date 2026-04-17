import Review from "../models/review.model.js";

class ReviewService {
    async create(payload) {
        try {
            const review = new Review({
                book_id: payload.book_id,
                user_id: payload.user_id,
                username: payload.username,
                rating: payload.rating,
                comment: payload.comment,
            });
            return await review.save();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async findByBookId(book_id) {
        return await Review.find({ book_id }).sort({ createdAt: -1 });
    }

    async findByUserId(user_id) {
        return await Review.find({ user_id }).sort({ createdAt: -1 }).populate('book_id', 'title');
    }

    async findAll() {
        return await Review.find().sort({ createdAt: -1 }).populate('book_id', 'title');
    }

    async delete(id) {
        return await Review.findByIdAndDelete(id);
    }
    
    async deleteAllByBookId(book_id) {
        return await Review.deleteMany({ book_id });
    }

    async updateReply(id, reply) {
        return await Review.findByIdAndUpdate(
            id, 
            { reply, repliedAt: Date.now() }, 
            { new: true }
        );
    }
}

export default ReviewService;
