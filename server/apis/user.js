import express from 'express';
import authMiddleware from '../middleware/auth.js';
import User from '../models/user.js';

const router = express.Router();

router.get('/api/users/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select('fullName username telegram plan')
            .lean();
            
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                error_code: 1005
            });
        }
        res.json(user);
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({
            message: 'Internal server error',
            error_code: 1006
        });
    }
});

export default router; 