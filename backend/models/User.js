const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  password: String,
  isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpires: Date,
  googleId: String,
  resumeData: {
    name: String,
    email: String,
    phone: String,
    skills: [String],
    experience: [{
      title: String,
      description: String,
      duration: String
    }],
    education: [{
      institution: String,
      degree: String,
      duration: String
    }],
    projects: [{
      title: String,
      description: String
    }],
    achievements: [{
      title: String,
      description: String
    }],
    keywords: [String]
  },
  // Add field to store AI-generated content
  generatedResumeContent: {
    skills: [String],
    experience: [{
      title: String,
      description: String,
      duration: String
    }],
    education: [{
      institution: String,
      degree: String,
      duration: String
    }],
    projects: [{
      title: String,
      description: String
    }],
    achievements: [{
      title: String,
      description: String
    }],
    professionalSummary: String
  }
});

module.exports = mongoose.model('User', UserSchema);