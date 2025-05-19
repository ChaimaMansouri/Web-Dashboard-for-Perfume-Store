const bcrypt = require('bcryptjs');
const User = require('../models/User');
const sendMail = require('../config/mailer');

// User Signup
exports.signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already registered. Please log in.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'New User Registration Request',
      html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color:rgba(239, 62, 255, 0.2);">
        <h2 style="color: #333;">New User Approval Request</h2>
        <p style="font-size: 16px; color: #555;">A new user needs approval:</p>
        <p style="font-weight: bold; font-size: 18px; color: #222;">${email}</p>
        <a href="https://project-dashboard-wc9p.onrender.com/auth/approve?email=${email}"
           style="display: inline-block; padding: 10px 20px; margin-top: 10px; 
                  background-color: #a421cd ; color: #fff; text-decoration: none; 
                  font-size: 16px; border-radius: 20px;box-shadow:1PX 1PX 2PX rgba(154, 154, 154, 0.24)">
          Approve User
        </a>
      </div>
    `
    
    });

    res.status(201).json({ message: 'Registration successful! Awaiting admin approval.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An internal error occurred. Please try again later.' });
  }
};

// User Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password.' });

    if (!user.approved) return res.status(400).json({ message: 'Your account needs admin approval.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password.' });

    res.status(200).json({ message: 'Login successful!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// Approve User
exports.approveUser = async (req, res) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found.' });

    user.approved = true;
    await user.save();

    sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Account Has Been Approved',
      html: '<div><p style="color: #333;font-size: 20px">Congratulations!</p><p > Your account has been approved, and you can now log in.</p></div>'
    });

    res.status(200).json({ message: 'User approved successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred. Please try again later.' });
  }
};

exports.logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

