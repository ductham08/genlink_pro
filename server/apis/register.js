import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';

const router = express.Router();

router.post('/api/register', async (req, res) => {
  try {
    const { fullName, telegram, username, password } = req.body;

    // Validate input
    if (!fullName || !username || !password) {
      return res.status(400).json({
        message: 'Vui lòng điền đầy đủ thông tin!',
        error_code: 1001
      });
    }

    // Validate username format
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      return res.status(400).json({
        message: 'Tên đăng nhập không được chứa dấu, khoảng trắng hoặc ký tự đặc biệt!',
        error_code: 1003
      });
    }

    // Validate password format
    if (!/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{8,}$/.test(password)) {
      return res.status(400).json({
        message: 'Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa và 1 ký tự đặc biệt!',
        error_code: 1004
      });
    }

    // Kiểm tra xem tên đăng nhập đã tồn tại chưa
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Tên đăng nhập đã tồn tại!',
        error_code: 1002
      });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới với plan mặc định
    const newUser = new User({
      fullName,
      telegram,
      username,
      password: hashedPassword,
      role: 'user',
      plan: {
        type: 'basic',
        usedLinks: 0,
        totalLinks: 70,
        registeredAt: new Date()
      }
    });

    await newUser.save();

    res.json({ 
      message: 'Đăng ký thành công, vui lòng tiến hành đăng nhập!',
      error_code: 200
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ 
      message: 'Có lỗi xảy ra, vui lòng thử lại!',
      error_code: 503
    });
  }
});

export default router; 