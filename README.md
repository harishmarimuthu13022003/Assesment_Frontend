# Assignment Workflow Portal - MERN Stack Project

A full-stack web application for managing assignments between teachers and students, built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Project Overview

This portal provides a workflow-driven system where:
- **Teachers** can create, manage, and review assignments through defined states (Draft → Published → Completed)
- **Students** can view published assignments and submit answers
- The system enforces proper access control and workflow rules

## Features

### Authentication
- Single login page for both teachers and students
- JWT-based authentication
- Role-based access control
- Secure password hashing with bcrypt

### Teacher Features
- Create assignments with title, description, and due date
- Manage assignment lifecycle (Draft → Published → Completed)
- Filter assignments by status
- View all student submissions
- Mark submissions as reviewed
- Dashboard analytics (total, draft, published, completed counts)
- Delete draft assignments only

### Student Features
- View only published assignments
- Submit answers (one per assignment)
- View submitted answers
- Cannot edit submissions after submission
- Prevented from submitting after due date

## Project Structure

```
tailwebs_assesment/
├── backend/          # Node.js + Express.js backend
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   ├── middleware/   # Authentication middleware
│   └── server.js     # Entry point
├── frontend/         # React.js frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── context/      # Context API
│   │   └── pages/        # Page components
│   └── ...
└── README.md         # This file
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/assignment_portal
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   NODE_ENV=development
   ```

5. Make sure MongoDB is running on your system.

6. Start the backend server:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:3000`

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

## Workflow Rules

### Assignment States
1. **Draft**: 
   - Editable and deletable
   - Not visible to students

2. **Published**: 
   - Visible to students for submission
   - Cannot be deleted
   - Cannot be edited (only status can be changed)

3. **Completed**: 
   - Locked after review
   - No further changes allowed

### Submission Rules
- Students can submit only one answer per assignment
- Submissions cannot be made after the due date
- Submissions cannot be edited after submission

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based route protection
- Input validation on both client and server
- CORS configuration
- Protected teacher-only routes

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- express-validator

### Frontend
- React.js 18
- React Router DOM
- Vite
- TailwindCSS
- Axios
- React Hot Toast
- Context API for state management

## Development Notes

- The backend uses MongoDB for data storage
- JWT tokens expire after 7 days
- All teacher routes are protected by `isTeacher` middleware
- All student routes are protected by `isStudent` middleware
- The frontend proxies API requests to the backend during development

## Testing the Application

1. **Register as a Teacher:**
   - Go to login page
   - Click "Sign up"
   - Fill in details and select "Teacher" role
   - You'll be redirected to Teacher Dashboard

2. **Create an Assignment:**
   - Click "Create Assignment"
   - Fill in title, description, and due date
   - Assignment is created in "Draft" status

3. **Publish Assignment:**
   - Click on the assignment
   - Click "Publish Assignment"
   - Status changes to "Published"

4. **Register as a Student:**
   - Logout and register a new account with "Student" role
   - You'll see the published assignment

5. **Submit Answer:**
   - Click on an assignment
   - Enter your answer and submit
   - You can view your submission but cannot edit it

6. **View Submissions (as Teacher):**
   - Login as teacher
   - Click "View Submissions" on a published assignment
   - See all student submissions
   - Mark submissions as reviewed

## Bonus Features Implemented

- ✅ Preventing submissions after due date
- ✅ Dashboard analytics for teachers
- ✅ Form validation on client and server
- ✅ Responsive design with TailwindCSS
- ✅ Error handling and user feedback

## License

This project is created for assessment purposes.

