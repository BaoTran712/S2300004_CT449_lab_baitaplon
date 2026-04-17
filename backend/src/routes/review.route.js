import express from "express";
import reviewController from "../controllers/review.controller.js";

const router = express.Router();

router.route("/")
    .get(reviewController.findAll)
    .post(reviewController.create);

router.route("/book/:bookId")
    .get(reviewController.findByBookId);

router.route("/:id")
    .delete(reviewController.deleteOne);

export default router;
