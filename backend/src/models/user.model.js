import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true,
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    birthday: {
        type: Date,
        required: true,
    },
    gender: {
        type: Boolean,
        required: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        default: "user",
    },
    avatar: {
        type: String,
        default: "",
    },
    points: {
        type: Number,
        default: 0,
    },
    fines: {
        type: Number,
        default: 0,
    },
    rewards: [{
        type: String
    }],
    suspended_until: {
        type: Date,
        default: null,
    }
},
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);
export default User;