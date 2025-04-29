import express from 'express';
import Link from '../models/link.js';
import authMiddleware from '../middleware/auth.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

router.delete('/api/links/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const link = await Link.findOne({ _id: id, userId });
        if (!link) {
            return res.status(404).json({
                message: 'Không tìm thấy link!',
                error_code: 1006
            });
        }

        // Get suffix from URL
        const suffix = link.url.split('/').pop();
        const dirPath = path.join(__dirname, '../build', suffix);

        // Delete files
        try {
            await fs.rm(dirPath, { recursive: true, force: true });
        } catch (error) {
            console.error('Error deleting files:', error);
        }

        // Delete from database
        await Link.findOneAndDelete({ _id: id, userId });

        res.json({
            message: 'Xóa link thành công!',
            error_code: 200
        });
    } catch (error) {
        console.error('Error deleting link:', error);
        res.status(500).json({
            message: 'Có lỗi xảy ra khi xóa link!',
            error_code: 503
        });
    }
});

router.put('/api/links/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { customSuffix } = req.body;
        const userId = req.user.userId;

        // Find the link
        const link = await Link.findOne({ _id: id, userId });
        if (!link) {
            return res.status(404).json({
                message: 'Không tìm thấy link!',
                error_code: 1006
            });
        }

        // Validate new suffix
        if (customSuffix) {
            if (!/^[a-zA-Z0-9-]{4,35}$/.test(customSuffix)) {
                return res.status(400).json({
                    message: 'Suffix phải chứa từ 4-35 ký tự chữ, số và dấu gạch ngang (-)!',
                    error_code: 1007
                });
            }

            // Check if new suffix is already used
            const existingLink = await Link.findOne({ 
                url: { $regex: customSuffix },
                _id: { $ne: id } // Exclude current link
            });
            if (existingLink) {
                return res.status(400).json({
                    message: 'Suffix này đã được sử dụng! Vui lòng chọn suffix khác.',
                    error_code: 1008
                });
            }

            // Get old suffix from current URL
            const oldSuffix = link.url.split('/').pop();
            
            // Update file system
            const oldDir = path.join(__dirname, '../build', oldSuffix);
            const newDir = path.join(__dirname, '../build', customSuffix);

            // Check if old directory exists
            try {
                await fs.access(oldDir);
            } catch (error) {
                return res.status(404).json({
                    message: 'Không tìm thấy thư mục chứa link!',
                    error_code: 1009
                });
            }

            // Rename directory
            await fs.rename(oldDir, newDir);

            // Update HTML file content
            const htmlPath = path.join(newDir, 'index.html');
            let htmlContent = await fs.readFile(htmlPath, 'utf8');
            htmlContent = htmlContent.replace(new RegExp(oldSuffix, 'g'), customSuffix);
            await fs.writeFile(htmlPath, htmlContent);

            // Update link in database
            const domain = process.env.LANDING_DOMAIN || `http://localhost:${process.env.PORT || 3000}`;
            const newUrl = `${domain}/build/${customSuffix}`;
            
            link.url = newUrl;
            await link.save();

            res.json({
                message: 'Cập nhật link thành công!',
                data: link,
                error_code: 200
            });
        } else {
            res.status(400).json({
                message: 'Vui lòng cũng cấp suffix mới!',
                error_code: 1010
            });
        }
    } catch (error) {
        console.error('Error updating link:', error);
        res.status(500).json({
            message: 'Có lỗi xảy ra khi cập nhật link!',
            error_code: 503
        });
    }
});

export default router; 