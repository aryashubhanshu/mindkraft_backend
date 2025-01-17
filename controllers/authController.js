import jwt from "jsonwebtoken";

import User from "../models/User.js";

// User registration
export const register = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const newUser = new User({ username, password, role: role || "user" });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// User login
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || !(await user.isPasswordValid(password))) {
      const error = new Error("Invalid username or password");
      error.statusCode = 401;
      return next(error);
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({ token });
  } catch (error) {
    next(error);
  }
};
