import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Kết nối đến MongoDB
const connectDB = async () => {
    try {
        const dbUrl = process.env.DATABASE_URL;
        const dbUrlWithCorrectDB = dbUrl.includes('/genlink-database') ? dbUrl : `${dbUrl}/genlink-database`;
            
        await mongoose.connect(dbUrlWithCorrectDB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB database:', mongoose.connection.db.databaseName);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

export default connectDB; 