import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import User from '../models/User.js';

dotenv.config();
const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;

// Temporary storage for OTPs (Consider using a database or Redis in production)
const otpStorage = new Map();

// **Zod Schemas for Validation**
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const otpSchema = z.object({
  email: z.string().email("Invalid email format"),
});

const verifyOtpSchema = z.object({
  email: z.string().email("Invalid email format"),
  otp: z.string().length(6, "OTP must be 6 characters"),
});

// **Nodemailer Transporter**
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// **Register User**
router.post('/register', async (req, res) => {
  try {
    const parsedData = registerSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({ message: "Validation error", errors: parsedData.error.errors });
    }

    const { username, email, password } = parsedData.data;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

// **Generate and Send OTP**
router.post('/send-otp', async (req, res) => {
  try {
    const parsedData = otpSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({ message: "Validation error", errors: parsedData.error.errors });
    }

    const { email } = parsedData.data;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStorage.set(email, otp);

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}`,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error });
  }
});

// **Verify OTP and Login**
router.post('/verify-otp', async (req, res) => {
  try {
    const parsedData = verifyOtpSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({ message: "Validation error", errors: parsedData.error.errors });
    }

    const { email, otp } = parsedData.data;
    if (otpStorage.get(email) !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const token = jwt.sign({ id: user._id }, SECRET_KEY);
    otpStorage.delete(email);

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP", error });
  }
});

export default router;
