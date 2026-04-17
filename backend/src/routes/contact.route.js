import express from "express";
import contactController from "../controllers/contact.controller.js";

const router = express.Router();

router.route("/")
    .get(contactController.findAll)
    .post(contactController.create);

router.route("/:id")
    .delete(contactController.deleteOne)
    .patch(contactController.updateStatus);

export default router;
