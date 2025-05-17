# Quado

A full-stack Task Management application built using the MERN stack (MongoDB, Express.js, React, Node.js). This app allows users to manage tasks efficiently with features like authentication, real-time updates, filtering, and a comprehensive analytics dashboard. The application also leverages Google's Gemini AI to provide intelligent task management and insights.


## Tech Stack

### Frontend
- React 19
- Vite
- TailwindCSS
- Framer Motion
- React Router DOM
- Axios
- React Hot Toast
- Recharts (for data visualization)

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT Authentication
- Google Gemini AI Integration
- Nodemailer
- Node-cron

## 📁 Project Structure

```
├── frontend/               # React frontend application
│   ├── src/               # Source files
│   ├── public/            # Static files
│   └── package.json       # Frontend dependencies
│
└── backend/               # Node.js backend application
    ├── config/           # Configuration files
    ├── controllers/      # Route controllers
    ├── middleware/       # Custom middleware
    ├── models/          # Database models
    ├── routes/          # API routes
    ├── scripts/         # Utility scripts
    └── server.js        # Entry point
```

## 🛠️ Setup and Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- npm or yarn

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

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. Start the server:
   ```bash
   npm start
   ```

## Features
- Modern UI with TailwindCSS
- Responsive design
- Real-time data visualization
- Secure authentication
- Task Management
  - Create, edit, and delete tasks
  - Task categorization (Personal, Work, Urgent, Other)
  - Task status tracking (Pending, In-Progress, Completed)
  - Due date management
  - Priority levels
  - Task filtering and sorting
  - Task details view
- Analytics Dashboard
  - Task completion statistics
  - Category distribution
  - Overdue tasks tracking
  - Due today tasks
  - 30-day task history
  - Performance insights
- AI-powered task management with Gemini
  - Daily Plan Generator
  - Smart Task Priority Assistant
  - Task Insights and Analytics
  - Motivational Quotes
  - Weekly Focus Suggestions
- User Experience
  - Toast notifications
  - Loading states
  - Error handling
  - Responsive navigation
  - Dark mode interface
- Data Security
  - JWT authentication
  - Protected routes
  - Secure API endpoints

## License
This project is licensed under the ISC License.

## Authors
- Jivit Rana

## Acknowledgments
- Thanks to all the open-source libraries and tools used in this project 