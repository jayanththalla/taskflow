# TaskFlow - Role-Based Project & Task Management System

A production-ready full-stack MERN (PostgreSQL) application for managing projects and tasks with granular role-based access control.

## 🚀 Live Demo
- **Frontend**: [TaskFlow Vercel](https://taskflow-zeta-blush.vercel.app)
- **Backend**: [TaskFlow Render API](https://taskflow-api-0tsz.onrender.com)

## 🛠 Tech Stack
- **Frontend**: React.js, Redux Toolkit, Tailwind CSS (Glassmorphism UI), Vite
- **Backend**: Node.js, Express.js, PostgreSQL, Sequelize
- **Database**: PostgreSQL
- **Authentication**: JWT (HttpOnly Cookies) + BCrypt

## 🔑 Features
- **Authentication**: Secure Login/Logout with Role-based redirection.
- **Admin Dashboard**: View all users, manage roles.
- **Manager Dashboard**: Create/Delete Projects, Assign Tasks, View Project Details.
- **User Dashboard**: View assigned tasks, update status (Todo -> In Progress -> Done).
- **Security**: Protected Routes, Password Hashing, CORS configuration.

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16+)
- PostgreSQL (Local or Cloud)

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/taskflow.git
cd taskflow
```

### 2. Backend Setup
```bash
cd server
npm install
```
- Create a `.env` file in `server/` with:
```env
PORT=5000
DATABASE_URL=postgres://user:pass@localhost:5432/taskflow
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```
- Ensure PostgreSQL is running and database `taskflow` exists.
- Run Server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
- Access the app at `http://localhost:5173`

## 🧪 Demo Credentials

The database will be automatically seeded with these users (Password: `password123`):

| Role    | Email                | Password      |
|---------|----------------------|---------------|
| **Admin**   | `admin@example.com`   | `password123` |
| **Manager** | `manager@example.com` | `password123` |
| **User**    | `user@example.com`    | `password123` |

## 🧪 Test Users (Roles)
Run the app and register a user.
- **Admin**: Has full access.
- **Manager**: Can manage projects/tasks.
- **User**: Can view/update assigned tasks.

*Note: Initial user creation might require database seeding or using the Register endpoint if enabled for Admins.*

## 📂 Project Structure
```
/client       # Frontend (React + Vite)
  /src
    /features # Redux Slices
    /pages    # Dashboards & Views
    /components
/server       # Backend (Express)
  /config     # DB Config
  /models     # Sequelize Models
  /controllers
  /routes
```
