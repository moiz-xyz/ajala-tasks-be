import jwt from "jsonwebtoken"; // 1. Added missing import
import User from "../models/User.js";

export const registerUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const token = jwt.sign(
        { id: existingUser._id, role: existingUser.role },
        process.env.JWT_SECRET,
        { expiresIn: "30d" },
      );

      return res.status(200).json({
        message: "User already registered. Logging you in...",
        token,
        user: {
          id: existingUser._id,
          email: existingUser.email,
          role: existingUser.role,
        },
      });
    }

    const newUser = await User.create({
      email,
      password,
      role: role || "viewer",
    });

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );

    res.status(201).json({
      message: "New account created successfully",
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
