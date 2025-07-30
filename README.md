# 🧠 Mental Health Tracker

A modern, user-friendly web application designed to help users track and improve their mental health through daily mood logging, personalized AI suggestions, and comprehensive analytics.

## 🌟 What This Project Does

The Mental Health Tracker is a comprehensive mental wellness application that helps users:

- **📝 Log Daily Moods**: Record how you're feeling each day with a simple 5-level mood system
- **💭 Add Personal Notes**: Write down thoughts, feelings, and experiences for each day
- **🤖 Get AI Suggestions**: Receive personalized recommendations based on your mood patterns
- **📊 View Progress**: See your mental health journey through beautiful charts and statistics
- **🔐 Secure Access**: Passwordless login using magic links sent to your email
- **📱 Use Anywhere**: Responsive design that works on desktop, tablet, and mobile

## ✨ Key Features

### 🔐 **Magic Link Authentication**
- No passwords to remember or forget
- Secure email-based login system
- 15-minute expiration for enhanced security
- Beautiful HTML email templates

### 📊 **Mood Tracking System**
- **5 Mood Levels**: Happy 😊, Good 🙂, Okay 😐, Sad 😔, Terrible 😢
- **Daily Logging**: Track your mood every day
- **Personal Notes**: Add detailed thoughts and feelings
- **Timestamp Tracking**: Automatic date and time recording

### 🤖 **AI-Powered Suggestions**
- **Contextual Recommendations**: Get suggestions based on your current mood
- **Personalized Advice**: Tailored mental health tips and activities
- **Supportive Messages**: Encouraging and helpful content
- **Best Practices**: Evidence-based mental health guidance

### 📈 **Analytics & Insights**
- **Mood Patterns**: Visualize your emotional journey over time
- **Statistics Dashboard**: See trends and patterns in your data
- **Filter Options**: View data by mood type or date range
- **Progress Tracking**: Monitor your mental health improvements

### 🎨 **Modern User Interface**
- **Dark/Light Mode**: Toggle between themes for your preference
- **Responsive Design**: Works perfectly on all devices
- **Beautiful UI**: Clean, modern interface with smooth animations
- **Accessibility**: Designed with accessibility in mind

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15 (React-based)
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Radix UI
- **Icons**: Lucide React
- **State Management**: React Hooks & Context API

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas (cloud database)
- **ORM**: Mongoose
- **Authentication**: JWT tokens
- **Email Service**: Nodemailer
- **Security**: Helmet, rate limiting, CORS

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (free tier available)
- Gmail account for email functionality

### Step 1: Clone the Repository
```bash
git clone <your-repository-url>
cd Mental-Health-Tracker
```

### Step 2: Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/mental-health-tracker?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_make_it_very_long_and_secure_at_least_32_characters
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
```

### Step 3: Frontend Setup
```bash
cd frontend
npm install
```

### Step 4: Start the Application
```bash
# Terminal 1 - Start Backend
cd backend
npm start

# Terminal 2 - Start Frontend
cd frontend
npm run dev
```

### Step 5: Access Your Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 📖 How to Use

### 1. **First Time Setup**
- Visit http://localhost:3000
- Enter your email address
- Check your email for a magic link
- Click the link to automatically log in

### 2. **Daily Mood Tracking**
- Click "Daily Log" in the navigation
- Select your mood level (Happy to Terrible)
- Add optional notes about your day
- Save your entry

### 3. **View Your Progress**
- Visit "History" to see all your past entries
- View mood statistics and patterns
- Filter entries by mood or date

### 4. **Get Personalized Suggestions**
- After logging your mood, receive AI-powered suggestions
- Get tips for improving your mental health
- Access supportive and encouraging content

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | ✅ Yes | - |
| `JWT_SECRET` | Secret key for JWT tokens | ✅ Yes | - |
| `PORT` | Backend server port | ❌ No | 3001 |
| `NODE_ENV` | Environment mode | ❌ No | development |
| `FRONTEND_URL` | Frontend URL for CORS | ❌ No | http://localhost:3000 |
| `SMTP_HOST` | SMTP server host | ❌ No | smtp.gmail.com |
| `SMTP_PORT` | SMTP server port | ❌ No | 587 |
| `SMTP_USER` | SMTP username (Gmail) | ✅ Yes | - |
| `SMTP_PASS` | SMTP password (Gmail App Password) | ✅ Yes | - |

### Gmail Setup for Magic Links
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. Use this app password in your `SMTP_PASS` environment variable

## 🔒 Security Features

- **JWT Authentication**: Secure token-based sessions
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configured for your frontend domain
- **Input Validation**: All user inputs validated and sanitized
- **Security Headers**: Helmet.js for enhanced security
- **Magic Link Expiration**: 15-minute security window

## 📱 API Endpoints

### Authentication
- `POST /api/auth/send-magic-link` - Send magic link email
- `POST /api/auth/verify-magic-link` - Verify magic link
- `GET /api/auth/me` - Get current user information

### Daily Logs
- `POST /api/daily-logs` - Create a new daily log
- `GET /api/daily-logs` - Get user's logs with pagination
- `GET /api/daily-logs/stats/mood` - Get mood statistics

### AI Suggestions
- `POST /api/analyze-mood` - Get AI suggestions based on mood

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 🐛 Troubleshooting

### Common Issues

**Magic Link Not Received**
- Check your spam folder
- Verify your email address is correct
- Ensure SMTP settings are properly configured

**Database Connection Issues**
- Verify your MongoDB Atlas connection string
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure your database user has proper permissions

**Frontend Not Loading**
- Make sure both backend and frontend are running
- Check browser console for errors
- Verify the frontend URL in your backend CORS settings

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. **Check the documentation** above
2. **Search existing issues** in the repository
3. **Create a new issue** with detailed information:
   - What you were trying to do
   - What happened instead
   - Steps to reproduce the issue
   - Your environment details

## 🙏 Acknowledgments

- Built with ❤️ for mental health awareness
- Inspired by the need for better mental health tracking tools
- Thanks to the open-source community for amazing tools and libraries

---

**Remember**: This tool is designed to help with mental health tracking, but it's not a substitute for professional mental health care. If you're experiencing severe mental health issues, please seek help from a qualified mental health professional.
