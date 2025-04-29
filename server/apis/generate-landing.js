import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import authMiddleware from '../middleware/auth.js';
import User from '../models/user.js';
import Link from '../models/link.js';
import authenticateToken from '../middleware/authenticate.js';

dotenv.config();

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();
const upload = multer({ dest: '/build/' });

// Use the correct port from the environment or default to 3000
const port = process.env.PORT || 3000;
const domain = process.env.LANDING_DOMAIN || `http://localhost:${port}`;

router.post('/api/generate-landing', authenticateToken, authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { title, description, redirectUrl, customSuffix } = req.body;

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
            return res.status(403).json({ message: `Bạn đã hết số lượt tạo link!` });
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

        // Validate custom suffix if provided
        let landingId;
        if (customSuffix) {
            // Check if suffix contains only alphanumeric characters and hyphens, and is between 4-20 characters
            if (!/^[a-zA-Z0-9-]{4,20}$/.test(customSuffix)) {
                return res.status(400).json({ 
                    message: 'Suffix phải chứa từ 4-20 ký tự chữ, số và dấu gạch ngang (-)!' 
                });
            }
            
            // Check if suffix is already used
            const existingLink = await Link.findOne({ url: { $regex: customSuffix } });
            if (existingLink) {
                return res.status(400).json({ 
                    message: 'Suffix này đã được sử dụng! Vui lòng chọn suffix khác.' 
                });
            }
            
            landingId = customSuffix;
        } else {
            landingId = generateShortId();
        }

        // Generate URL in short format
        const generatedUrl = `${domain}/${landingId}`;

        // Create directory for this landing page
        const landingDir = path.join(__dirname, '../build', landingId);
        await fs.mkdir(landingDir, { recursive: true });

        // Move the image to the landing directory
        const imageExtension = path.extname(req.file.originalname);
        const imageFileName = `image${imageExtension}`;
        const finalImagePath = path.join(landingDir, imageFileName);
        await fs.rename(req.file.path, finalImagePath);

        // Create the HTML content with correct image path
        const htmlContent = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <meta name="description" content="${description}">
        <meta property="og:title" content="${title}">
        <meta property="og:description" content="${description}">
        <meta property="og:image" content="./${imageFileName}">
        <meta property="og:image:type" content="image/${imageExtension.slice(1)}">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${title}">
        <meta name="twitter:description" content="${description}">
        <meta name="twitter:image" content="./${imageFileName}">
        <script>
            async function trackVisit() {
                try {
                    const response = await fetch('/api/visits/${landingId}', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    const data = await response.json();
                    if (data.redirectUrl) {
                        window.location.replace(data.redirectUrl);
                    }
                } catch (error) {
                    console.error('Error tracking visit:', error);
                    window.location.replace("${redirectUrl}");
                }
            }

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
                    trackVisit();
                } else {
                    document.getElementById('content').style.display = 'block';
                }
            };
        </script>
    </head>
    <body>
        <div id="content" style="display: none">
            <h1>${title}</h1>
            <img src="./${imageFileName}" alt="${title}" width="100%">
            <p>${description}</p>
        </div>
    </body>
    </html>
        `;

        // Save the HTML file
        const htmlFilePath = path.join(landingDir, 'index.html');
        await fs.writeFile(htmlFilePath, htmlContent);

        // Lưu link vào cơ sở dữ liệu
        const newLink = new Link({
            userId: user._id,
            plan: plan.type,
            createdAt: new Date(),
            url: generatedUrl,
            redirectUrl: redirectUrl,
            clicks: 0,
        });
        await newLink.save();

        // Counter click
        user.plan.usedLinks += 1;
        await user.save();

        res.json({
            url: generatedUrl,
            imageUrl: `${domain}/${landingId}/${imageFileName}`
        });
    } catch (error) {
        console.error('Error generating landing page:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router; 