import ReviewService from "../services/review.service.js";
import ApiError from "../api-error.js";

const reviewService = new ReviewService();

export async function findAll(req, res, next) {
    try {
        const documents = await reviewService.findAll();
        return res.json(documents);
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "Error while retrieving all reviews"));
    }
}

export async function create(req, res, next) {
    if (!req.body?.book_id || !req.body?.rating) {
        return next(new ApiError(400, "Book ID and rating are required"));
    }

    try {
        const document = await reviewService.create(req.body);
        return res.status(201).json(document);
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "Error while creating review"));
    }
}

export async function findByBookId(req, res, next) {
    try {
        const documents = await reviewService.findByBookId(req.params.bookId);
        return res.json(documents);
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "Error while retrieving reviews"));
    }
}

export async function findByUserId(req, res, next) {
    try {
        const documents = await reviewService.findByUserId(req.params.userId);
        return res.json(documents);
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "Error while retrieving user reviews"));
    }
}

export async function deleteOne(req, res, next) {
    try {
        const document = await reviewService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Review not found"));
        }
        return res.json({ message: "Review deleted successfully" });
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "Error while deleting review"));
    }
}

export async function updateReply(req, res, next) {
    if (req.body?.reply === undefined) {
        return next(new ApiError(400, "Reply content is required"));
    }

    try {
        const document = await reviewService.updateReply(req.params.id, req.body.reply);
        if (!document) {
            return next(new ApiError(404, "Review not found"));
        }
        return res.json(document);
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "Error while updating reply"));
    }
}

export default {
    findAll, create, findByBookId, findByUserId, deleteOne, updateReply
};
