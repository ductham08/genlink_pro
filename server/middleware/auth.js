import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                message: 'Vui lòng đăng nhập để tiếp tục!',
                error_code: 1001
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Chỉ kiểm tra sự tồn tại của user
        const user = await User.findById(decoded.userId).select('_id username role');
        
        if (!user) {
            return res.status(401).json({
                message: 'Phiên đăng nhập không hợp lệ!',
                error_code: 1002
            });
        }

        // Lưu thông tin user vào request
        req.user = {
            userId: user._id,
            username: user.username,
            role: user.role
        };
        
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Phiên đăng nhập đã hết hạn!',
                error_code: 1003
            });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: 'Phiên đăng nhập không hợp lệ!',
                error_code: 1004
            });
        }
        return res.status(401).json({
            message: 'Phiên đăng nhập không hợp lệ!',
            error_code: 1004
        });
    }
};

export default authMiddleware; 