const nodemailer = require('nodemailer');
const config = require('../config');

// Create transporter
const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

// Send magic link email
const sendMagicLinkEmail = async (email, magicLink) => {
  try {
    const mailOptions = {
      from: `"Mental Health Tracker" <${config.email.user}>`,
      to: email,
      subject: "Your Magic Link - Sign in to Mental Health Tracker",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to Mental Health Tracker</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your Daily Mood Companion</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Sign in to your account</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Click the button below to securely sign in to your Mental Health Tracker account. This link will expire in 15 minutes.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${magicLink}" 
                 style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; font-size: 16px;">
                Sign In to Mental Health Tracker
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px; margin-top: 25px; text-align: center;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${magicLink}" style="color: #667eea; word-break: break-all;">${magicLink}</a>
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              This email was sent because someone requested to sign in to your Mental Health Tracker account.<br>
              If you didn't request this, you can safely ignore this email.
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Magic link email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending magic link email:', error);
    return false;
  }
};

// Verify email configuration
const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log('Email configuration is valid');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
};

module.exports = {
  sendMagicLinkEmail,
  verifyEmailConfig,
}; 