import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors())

// Connect to MongoDB //thunder client
connectDB();

// Routes
app.use('/api/auth', authRoutes);

// Default Route
app.get('/', (req, res) => {
  res.json({ message: "API is running..." });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
