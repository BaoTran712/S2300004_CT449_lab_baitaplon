import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Tên không được để trống"],
    },
    email: {
        type: String,
        required: [true, "Email không được để trống"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Email không hợp lệ"],
    },
    phone: {
        type: String,
    },
    subject: {
        type: String,
        required: [true, "Tiêu đề không được để trống"],
    },
    message: {
        type: String,
        required: [true, "Nội dung không được để trống"],
    },
    response: {
        type: String,
        default: null,
    },
    status: {
        type: String,
        enum: ["pending", "responded"],
        default: "pending",
    },
    respondedAt: {
        type: Date,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
