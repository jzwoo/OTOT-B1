import mongoose from "mongoose";

const Schema = mongoose.Schema

const contactSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    contact: {
        type: Number,
        required: true,
        unique: true
    }
}, { timestamps: true })

export default mongoose.model('Contact', contactSchema)
