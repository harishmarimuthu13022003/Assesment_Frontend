# Assignment Portal - Frontend

Frontend application for the Assignment Workflow Portal built with React.js, Vite, and TailwindCSS.

## Features

- Single login page for both teachers and students
- Role-based dashboard redirection
- Teacher Dashboard:
  - Create and manage assignments
  - Filter assignments by status (Draft, Published, Completed)
  - View student submissions
  - Assignment workflow management
  - Dashboard analytics
- Student Dashboard:
  - View published assignments
  - Submit answers (one per assignment)
  - View submitted answers
  - Prevent editing after submission

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

The application will be available at `http://localhost:3000`

## Configuration

The frontend is configured to proxy API requests to `http://localhost:5000` (backend server). Make sure the backend is running before using the frontend.

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   │   ├── teacher/     # Teacher-specific components
│   │   └── student/     # Student-specific components
│   ├── context/         # React Context (Auth)
│   ├── pages/           # Page components
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # TailwindCSS configuration
└── package.json         # Dependencies
```

## Usage

1. **Register/Login:**
   - Use the login page to register a new account or login
   - Select role (Teacher or Student) during registration
   - After login, you'll be redirected to your role-specific dashboard

2. **As a Teacher:**
   - Create assignments with title, description, and due date
   - Manage assignment status (Draft → Published → Completed)
   - View all student submissions
   - Filter assignments by status
   - View dashboard analytics

3. **As a Student:**
   - View all published assignments
   - Submit answers for assignments
   - View your submitted answers
   - Cannot edit submissions after submission

## Technologies Used

- React.js 18
- React Router DOM
- Vite
- TailwindCSS
- Axios
- React Hot Toast

## Notes

- All API calls are made to `/api/*` endpoints which are proxied to the backend
- JWT tokens are stored in localStorage
- The app automatically redirects based on user role after login
- Form validation is implemented on both client and server side

