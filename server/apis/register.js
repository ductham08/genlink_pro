import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';

const router = express.Router();

router.post('/api/register', async (req, res) => {
  try {
    const { fullName, telegram, username, password, role } = req.body;

    // Kiểm tra xem tên đăng nhập đã tồn tại chưa
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại!' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const newUser = new User({
      fullName,
      telegram,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    res.json({ message: 'Đăng ký thành công!' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại!' });
  }
});

export default router; 