import express from 'express';
import Link from '../models/link.js';

const router = express.Router();

// API để lấy số lượt truy cập của một link
router.get('/api/visits/:id', async (req, res) => {
    try {
        const linkId = req.params.id;
        const link = await Link.findOne({ url: { $regex: linkId } });
        
        if (!link) {
            return res.status(404).json({ message: 'Link không tồn tại!' });
        }

        res.json({ 
            visits: link.clicks,
            url: link.url,
            redirectUrl: link.redirectUrl
        });
    } catch (error) {
        console.error('Error getting visit count:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// API để tăng số lượt truy cập của một link
router.post('/api/visits/:id', async (req, res) => {
    try {
        const linkId = req.params.id;
        const link = await Link.findOne({ url: { $regex: linkId } });
        
        if (!link) {
            return res.status(404).json({ message: 'Link không tồn tại!' });
        }

        // Tăng số lượt truy cập
        link.clicks += 1;
        await link.save();

        res.json({ 
            visits: link.clicks,
            url: link.url,
            redirectUrl: link.redirectUrl
        });
    } catch (error) {
        console.error('Error incrementing visit count:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

export default router; 