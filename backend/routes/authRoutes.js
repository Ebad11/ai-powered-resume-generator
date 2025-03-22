const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const nodemailer = require('nodemailer');

const router = express.Router();

// OTP Generation and Email Sending
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Passport Google Strategy (No Session)
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        isVerified: true,
        resumeData: {
          name: profile.displayName,
          email: profile.emails[0].value,
          phone: '', // Phone is not available from Google, so leave it empty
          skills: [],
          experience: [],
          education: [],
          projects: [],
          achievements: [],
          keywords: []
        }
      });
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// Signup route
router.post('/signup', async (req, res) => {
  const { 
    name, 
    email, 
    phone, 
    password, 
    confirmPassword, 
    skills, 
    experience, 
    education, 
    projects, 
    achievements, 
    keywords 
  } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email already exists' });

    user = await User.findOne({ phone });
    if (user) return res.status(400).json({ message: 'Phone number already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000,
      resumeData: {
        name, // Use the same name as the user
        email,
        phone,
        skills: skills || [],
        experience: experience || [],
        education: education || [],
        projects: projects || [],
        achievements: achievements || [],
        keywords: keywords || []
      }
    });

    await newUser.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email',
      text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    });

    res.status(200).json({ message: 'OTP sent to email', email });

  } catch (error) {
    res.status(500).json({ error: 'Signup failed', message: error.message });
  }
});

// Verify OTP and generate JWT token
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      message: 'Email verified successfully',
      token,
      user,
    });

  } catch (error) {
    res.status(500).json({ error: 'OTP verification failed', message: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { emailOrPhone, password } = req.body;

  try {
    const user = await User.findOne({ $or: [{ email: emailOrPhone }, { phone: emailOrPhone }] });

    if (!user) return res.status(400).json({ message: 'User not found' });
    if (!user.isVerified) return res.status(400).json({ message: 'Email not verified' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ token, user });

  } catch (error) {
    res.status(500).json({ error: 'Login failed', message: error.message });
  }
});

// Google Auth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  async (req, res) => {
    try {
      const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

      // Check if resumeData is populated
      const needsResumeData = !req.user.resumeData || !req.user.resumeData.skills || req.user.resumeData.skills.length === 0;

      // Redirect to frontend with token and a flag indicating if resume data is needed
      res.redirect(`http://localhost:3000/dashboard?token=${token}&needsResumeData=${needsResumeData}`);
    } catch (error) {
      res.status(500).json({ error: 'Google authentication failed', message: error.message });
    }
  }
);

// Logout route (JWT doesn’t require server-side logout, but can clear client-side token)
router.get('/logout', (req, res) => {
  // Since we're using JWT, logout is typically handled client-side by removing the token
  res.status(200).json({ message: 'Logged out successfully (clear token on client)' });
});

// Check if user is authenticated (requires JWT middleware)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user; // user contains { id: user._id }
    next();
  });
};

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const needsResumeData = !user.resumeData || !user.resumeData.skills || user.resumeData.skills.length === 0;
    const hasGeneratedContent = !!user.generatedResumeContent;

    res.status(200).json({ 
      user,
      needsResumeData,
      hasGeneratedContent,
      tailoredResumes: user.tailoredResumes.map(tr => ({
        position: tr.position,
        field: tr.field
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
// Update resume data route
router.put('/update-resume-data', authenticateToken, async (req, res) => {
  const { skills, experience, education, projects, achievements, keywords } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update the resumeData field
    user.resumeData = {
      name: user.name, // Use the user's name from their profile
      email: user.email,
      phone: user.phone || '', // Phone might not be available from Google, so allow updates
      skills: skills || [],
      experience: experience || [],
      education: education || [],
      projects: projects || [],
      achievements: achievements || [],
      keywords: keywords || []
    };

    await user.save();
    res.status(200).json({ message: 'Resume data updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update resume data', message: error.message });
  }
});

module.exports = router;