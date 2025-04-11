import express from 'express';
import Link from '../models/link.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/api/links', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const links = await Link.find({ userId })
            .sort({ createdAt: -1 })
            .select('-__v');

        res.json({
            message: 'Lấy danh sách link thành công!',
            data: links,
            error_code: 200
        });
    } catch (error) {
        console.error('Error fetching links:', error);
        res.status(500).json({
            message: 'Có lỗi xảy ra khi lấy danh sách link!',
            error_code: 503
        });
    }
});

router.get('/api/links/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const link = await Link.findOne({ _id: id, userId })
            .select('-__v');

        if (!link) {
            return res.status(404).json({
                message: 'Không tìm thấy link!',
                error_code: 1006
            });
        }

        res.json({
            message: 'Lấy thông tin link thành công!',
            data: link,
            error_code: 200
        });
    } catch (error) {
        console.error('Error fetching link details:', error);
        res.status(500).json({
            message: 'Có lỗi xảy ra khi lấy thông tin link!',
            error_code: 503
        });
    }
});

export default router; 