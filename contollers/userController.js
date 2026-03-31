import User from "../models/User.js";

export const registerUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(200).json({
        message: "User already registered. Logging you in...",
        user: {
          id: existingUser._id,
          email: existingUser.email,
        },
      });
    }

    const newUser = await User.create({
      email,
      password,
    });

    res.status(201).json({
      message: "New account created successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
