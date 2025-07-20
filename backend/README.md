# Mental Health Tracker Backend

A Node.js backend API for the Mental Health Tracker application, built with Express.js and MongoDB Atlas.

## Features

- **Authentication**: JWT-based authentication with magic link support
- **User Management**: User registration, login, and profile management
- **Daily Logs**: CRUD operations for daily mood tracking
- **Email Integration**: Magic link email delivery
- **Security**: Helmet.js security headers, rate limiting, CORS
- **Database**: MongoDB Atlas integration with Mongoose ODM

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **ORM**: Mongoose
- **Authentication**: JWT, bcryptjs
- **Email**: Nodemailer
- **Security**: Helmet, express-rate-limit
- **Validation**: express-validator

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
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

4. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/send-magic-link` - Send magic link email
- `POST /api/auth/verify-magic-link` - Verify magic link
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Daily Logs
- `POST /api/daily-logs` - Create daily log
- `GET /api/daily-logs` - Get user logs
- `GET /api/daily-logs/:id` - Get specific log
- `PUT /api/daily-logs/:id` - Update log
- `DELETE /api/daily-logs/:id` - Delete log
- `GET /api/daily-logs/stats/mood` - Get mood statistics

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get specific user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | Required |
| `JWT_SECRET` | Secret key for JWT tokens | Required |
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment mode | development |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |
| `SMTP_HOST` | SMTP server host | smtp.gmail.com |
| `SMTP_PORT` | SMTP server port | 587 |
| `SMTP_USER` | SMTP username | Required |
| `SMTP_PASS` | SMTP password | Required |

## Development

Run in development mode with auto-restart:
```bash
npm run dev
```

## License

ISC 