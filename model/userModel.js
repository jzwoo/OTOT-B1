import mongoose from "mongoose";

const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
        type: String,
        default: 'basic',
        enum: ['basic', 'supervisor', 'admin']
    },
    accessToken: {
        type: String
    }
})

export default mongoose.model('User', userSchema)
