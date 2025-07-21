// config.js for Vercel serverless (ES module)

export const config = {
  mongodb: {
    uri: process.env.MONGODB_URI
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '7d'
  },
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true
  },
  email: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
}; 