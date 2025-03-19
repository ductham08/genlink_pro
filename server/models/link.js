import mongoose from 'mongoose';

// Định nghĩa schema cho link
const linkSchema = new mongoose.Schema({
    username: { type: String, required: true },
    plan: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    url: { type: String, required: true },
    redirectUrl: { type: String, required: true }, // Link đích khi redirect
    clicks: { type: Number, default: 0 },
});

const Link = mongoose.model('Link', linkSchema);

export default Link; 