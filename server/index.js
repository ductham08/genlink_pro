import express from 'express';
import path, { dirname } from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import generateLandingRouter from './apis/generate-landing.js';
import authRouter from './apis/auth.js';
import registerRouter from './apis/register.js';
import trackVisitRouter from './apis/track-visit.js';
import connectDB from './database.js';
import { fileURLToPath } from 'url';

// Load environment variables from .env file
dotenv.config();

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Kết nối đến cơ sở dữ liệu
connectDB();

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());
app.use(cors());

app.use(generateLandingRouter);
app.use(authRouter);
app.use(registerRouter);
app.use(trackVisitRouter);

// Handle clean URLs for landing pages
app.get('/build/:id', (req, res) => {
    const landingPath = path.join(__dirname, 'build', req.params.id, 'index.html');
    res.sendFile(landingPath);
});
app.get('/build/:id/*', (req, res) => {
    const imageFile = path.join(__dirname, 'build', req.params.id, req.params[0]);
    res.sendFile(imageFile);
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Use the port from the environment or default to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));