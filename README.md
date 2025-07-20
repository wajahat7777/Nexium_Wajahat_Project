# Mental Health Tracker

A comprehensive mental health tracking application built with Next.js frontend and Node.js backend, featuring magic link authentication, daily mood logging, and personalized suggestions.

## Features

- **🔐 Magic Link Authentication** - Secure, passwordless login via email
- **📧 Email Integration** - Beautiful HTML emails with magic links
- **📊 Mood Tracking** - Daily mood logging with 5 different mood levels
- **💡 AI Suggestions** - Personalized suggestions based on your mood
- **📈 Analytics** - Mood patterns and statistics visualization
- **📱 Responsive Design** - Works perfectly on all devices
- **🗄️ Data Persistence** - All data stored in MongoDB Atlas

## Tech Stack

### Frontend
- **Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Radix UI
- **Icons**: Lucide React
- **State Management**: React Hooks

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **ORM**: Mongoose
- **Authentication**: JWT tokens
- **Email**: Nodemailer
- **Security**: Helmet, rate limiting, CORS

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Gmail account for SMTP

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Mental-Health-Tracker
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   
   Create `.env` file:
   ```env
   MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/mental-health-tracker?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key_here_make_it_very_long_and_secure
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password_here
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Start the Application**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm start
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Usage

1. **Sign In**: Enter your email to receive a magic link
2. **Check Email**: Click the magic link in your email
3. **Track Mood**: Add daily mood logs with notes
4. **Get Suggestions**: Receive personalized mood suggestions
5. **View History**: See your mood patterns and statistics

## API Endpoints

### Authentication
- `POST /api/auth/send-magic-link` - Send magic link email
- `POST /api/auth/verify-magic-link` - Verify magic link
- `GET /api/auth/me` - Get current user

### Daily Logs
- `POST /api/daily-logs` - Create daily log
- `GET /api/daily-logs` - Get user logs with pagination
- `GET /api/daily-logs/stats/mood` - Get mood statistics

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | Required |
| `JWT_SECRET` | Secret key for JWT tokens | Required |
| `PORT` | Backend server port | 3001 |
| `NODE_ENV` | Environment mode | development |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |
| `SMTP_HOST` | SMTP server host | smtp.gmail.com |
| `SMTP_PORT` | SMTP server port | 587 |
| `SMTP_USER` | SMTP username | Required |
| `SMTP_PASS` | SMTP password | Required |

## Features in Detail

### Magic Link Authentication
- No passwords required
- Secure email-based authentication
- 15-minute expiration for security
- Beautiful HTML email templates

### Mood Tracking
- 5 mood levels: Happy, Good, Okay, Sad, Terrible
- Optional notes for each log
- Timestamp tracking
- User-specific data isolation

### AI Suggestions
- Contextual suggestions based on mood
- Personalized recommendations
- Mental health best practices
- Supportive and encouraging messages

### Analytics
- Mood pattern visualization
- Statistics dashboard
- Filter by mood type
- Pagination for large datasets

## Security Features

- **JWT Authentication**: Secure token-based sessions
- **Rate Limiting**: 100 requests per 15 minutes
- **CORS Protection**: Configured for frontend domain
- **Input Validation**: All inputs validated and sanitized
- **Helmet Security**: Security headers enabled
- **Password Hashing**: bcrypt for password storage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support or questions, please open an issue in the repository.
