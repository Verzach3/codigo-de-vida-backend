import mongoose from "mongoose";

export const User = mongoose.model("User", new mongoose.Schema({
    id: String,
    name: String,
    email: String,
    password: String
}));
