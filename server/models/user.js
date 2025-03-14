import mongoose from 'mongoose';

// Định nghĩa schema cho người dùng
const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    telegram: { type: String },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: 'user' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

export default User; 