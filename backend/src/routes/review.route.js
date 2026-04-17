import express from "express";
import reviewController from "../controllers/review.controller.js";

const router = express.Router();

router.route("/")
    .get(reviewController.findAll)
    .post(reviewController.create);

router.route("/book/:bookId")
    .get(reviewController.findByBookId);

router.route("/user/:userId")
    .get(reviewController.findByUserId);

router.route("/:id")
    .delete(reviewController.deleteOne)
    .patch(reviewController.updateReply);

export default router;
