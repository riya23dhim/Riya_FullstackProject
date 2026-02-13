# Nexus - Full Stack Todo & Notification App

A modern, full-stack Task Management application featuring real-time updates, secure authentication, and a responsive dashboard.

## Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Networking**: Axios, Socket.IO Client
- **Notifications**: React Hot Toast

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **Real-Time**: Socket.IO Gateway
- **Auth**: Passport.js, JWT, Bcrypt
- **Email**: Nodemailer

## API Endpoints

### Authentication
- `POST /auth/signup`: Register a new user
- `POST /auth/login`: Authenticate and receive tokens
- `POST /auth/logout`: Invalidate session
- `POST /auth/refresh`: Refresh access token
- `POST /auth/forgot-password`: Request password reset email
- `POST /auth/reset-password`: Reset password with token

### Users
- `GET /users/me`: Get current user profile
- `PATCH /users/me`: Update profile details
- `POST /users/avatar`: Upload profile picture
- `GET /users`: List all users (Admin only)
- `DELETE /users/:id`: Soft delete user (Admin only)

### Todos
- `GET /todos`: Get all tasks for current user
- `POST /todos`: Create a new task
- `PATCH /todos/:id`: Update task status/details
- `DELETE /todos/:id`: Remove a task

### Notifications
- `GET /notifications`: Get user notifications
- `PATCH /notifications/:id/read`: Mark notification as read

## Main Features
- **Secure Authentication**: JWT-based auth with Access & Refresh tokens.
- **Role-Based Access**: User and Admin roles with protected routes.
- **Real-Time Notifications**: Instant alerts for task updates via WebSockets.
- **Task Management**: CRUD operations with responsive UI.
- **Admin Dashboard**: Manage users and monitor system activity.
- **Password Recovery**: Secure email-based password reset flow.
- **File Upload**: Profile picture management.

## Environment Variables

### Backend (.env)
Create a `.env` file in the `backend` directory:
```env
MONGO_URI=
JWT_SECRET=
PORT=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
FRONTEND_URL=

```

### Frontend (.env)
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=
VITE_SOCKET_URL=

```
