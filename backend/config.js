require('dotenv').config();

module.exports = {
  // MongoDB Atlas Configuration
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb+srv://wajahat:hello@cluster0.ts6enj7.mongodb.net/blogdb?retryWrites=true&w=majority&appName=Cluster0'
  },
  
  // Server Configuration
  server: {
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development'
  },
  
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key_here_make_it_very_long_and_secure',
    expiresIn: '7d'
  },
  
  // CORS Configuration
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  },
  
  // Email Configuration (optional for magic links)
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    user: process.env.SMTP_USER || 'wajahatcru@gmail.com',
    pass: process.env.SMTP_PASS || 'kkcy ywek zhhk kvqr'
  }
}; 