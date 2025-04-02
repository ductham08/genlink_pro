import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const router = express.Router();

router.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Tìm người dùng trong cơ sở dữ liệu
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng!', error_code: 1001 });
    }

    // So sánh mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng!', error_code: 1001 });
    }

    // Tạo JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.json({ 
      message: 'Đăng nhập thành công, bạn sẽ được chuyển hướng về trang chủ!', 
      token,
      error_code: 200
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại!', error_code: 503 });
  }
});

export default router; 