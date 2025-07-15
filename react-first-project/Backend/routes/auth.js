// auth.js or your route file
const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Adjust the path if needed

router.post('/Login', async (req, res) => {
  const { userId, password } = req.body;

  try {
    // Check if user already exists
    let existingUser = await User.findOne({ userId });

    if (!existingUser) {
      // If user doesn't exist, create a new one (only if this is your registration logic)
      const newUser = new User({ userId, password });
      await newUser.save();
      return res.status(201).json({ message: 'User created successfully' });
    }

    // If user exists, verify password
    if (existingUser.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.status(200).json({ message: 'Login successful', user: existingUser });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
