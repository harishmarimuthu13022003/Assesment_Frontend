# Assignment Portal - Backend

Backend API for the Assignment Workflow Portal built with Node.js, Express.js, and MongoDB.

## Features

- JWT-based authentication
- Role-based access control (Teacher/Student)
- Assignment management with workflow states (Draft → Published → Completed)
- Student submission system
- Input validation and error handling
- Security best practices

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables:**
   Edit `.env` file and set:
   - `PORT`: Server port (default: 5000)
   - `MONGODB_URI`: MongoDB connection string
   - `JWT_SECRET`: Secret key for JWT tokens
   - `NODE_ENV`: Environment (development/production)

4. **Start MongoDB:**
   Make sure MongoDB is running on your system.

5. **Run the server:**
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Assignments
- `GET /api/assignments` - Get assignments (filtered by role and status)
- `GET /api/assignments/:id` - Get single assignment
- `POST /api/assignments` - Create assignment (Teacher only)
- `PUT /api/assignments/:id` - Update assignment (Teacher only)
- `PATCH /api/assignments/:id/status` - Update assignment status (Teacher only)
- `DELETE /api/assignments/:id` - Delete assignment (Teacher only)
- `GET /api/assignments/:id/submissions` - Get submissions for assignment (Teacher only)

### Submissions
- `POST /api/submissions` - Submit answer (Student only)
- `GET /api/submissions/assignment/:assignmentId` - Get submission(s) for assignment
- `GET /api/submissions/my-submissions` - Get all student's submissions
- `PATCH /api/submissions/:id/review` - Mark submission as reviewed (Teacher only)

## Project Structure

```
backend/
├── models/          # MongoDB models
├── routes/          # API routes
├── middleware/      # Authentication middleware
├── server.js        # Entry point
├── package.json     # Dependencies
└── README.md        # This file
```

## Notes

- All teacher-only routes are protected by `isTeacher` middleware
- All student-only routes are protected by `isStudent` middleware
- JWT token should be sent in Authorization header: `Bearer <token>`
- Assignment status transitions: Draft → Published → Completed
- Students can only submit one answer per assignment
- Submissions cannot be made after the due date

