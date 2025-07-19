const nodemailer = require('nodemailer')

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

// Send magic link email
const sendMagicLink = async (email, token, redirectUrl) => {
  try {
    const transporter = createTransporter()
    
    const magicLink = `${redirectUrl}?token=${token}`
    
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Sign in to Nexium',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Welcome to Nexium</h2>
          <p>Click the button below to sign in to your account:</p>
          <a href="${magicLink}" 
             style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Sign In
          </a>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #6b7280;">${magicLink}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this email, you can safely ignore it.</p>
        </div>
      `
    }
    
    const result = await transporter.sendMail(mailOptions)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Send magic link error:', error)
    throw new Error('Failed to send magic link email')
  }
}

// Send welcome email
const sendWelcomeEmail = async (email, firstName) => {
  try {
    const transporter = createTransporter()
    
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Welcome to Nexium!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Welcome to Nexium, ${firstName || 'there'}!</h2>
          <p>Thank you for joining Nexium. We're excited to help you track your daily mood and get AI-powered insights.</p>
          <p>Here's what you can do:</p>
          <ul>
            <li>Log your daily mood and thoughts</li>
            <li>Get personalized AI suggestions</li>
            <li>Track your mood trends over time</li>
            <li>View your mental health insights</li>
          </ul>
          <p>Start your journey by logging your first mood entry!</p>
          <a href="${process.env.FRONTEND_URL}/daily-log" 
             style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Start Logging
          </a>
          <p>If you have any questions, feel free to reach out to our support team.</p>
        </div>
      `
    }
    
    const result = await transporter.sendMail(mailOptions)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Send welcome email error:', error)
    throw new Error('Failed to send welcome email')
  }
}

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const transporter = createTransporter()
    
    const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`
    
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Reset Your Nexium Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Password Reset Request</h2>
          <p>You requested to reset your password. Click the button below to create a new password:</p>
          <a href="${resetLink}" 
             style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Reset Password
          </a>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #6b7280;">${resetLink}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this password reset, you can safely ignore this email.</p>
        </div>
      `
    }
    
    const result = await transporter.sendMail(mailOptions)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Send password reset email error:', error)
    throw new Error('Failed to send password reset email')
  }
}

// Send streak notification
const sendStreakNotification = async (email, streakCount) => {
  try {
    const transporter = createTransporter()
    
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: `🎉 ${streakCount} Day Streak!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Congratulations!</h2>
          <p>You've maintained a ${streakCount}-day streak of logging your mood! 🎉</p>
          <p>Consistency is key to understanding your mental health patterns. Keep up the great work!</p>
          <a href="${process.env.FRONTEND_URL}/daily-log" 
             style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Log Today's Mood
          </a>
          <p>Your dedication to self-reflection is inspiring!</p>
        </div>
      `
    }
    
    const result = await transporter.sendMail(mailOptions)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Send streak notification error:', error)
    throw new Error('Failed to send streak notification')
  }
}

module.exports = {
  sendMagicLink,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendStreakNotification
} 