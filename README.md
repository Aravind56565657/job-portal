# 🚀 JobPortal - Advanced Job Listing Platform

A modern, full-stack job portal application built with the MERN stack (MongoDB, Express, React, Node.js). This platform connects job seekers with employers, offering a seamless experience for posting jobs, applying for roles, and managing the recruitment process.

## ✨ Features

### 👤 User Roles
*   **Job Seekers**: Explore opportunities and manage their career profile.
*   **Employers**: Post jobs and manage incoming applications.

### 🌟 For Job Seekers
*   **Comprehensive Profile**: Create a detailed profile with Work Experience, Education, Skills, and Certifications.
*   **Resume Upload**: Securely upload and manage PDF resumes (powered by Cloudinary).
*   **Smart Job Search**: Filter jobs by keywords, location, salary, and employment type.
*   **Application Tracking**: Real-time status updates on applications (Reviewing, Shortlisted, Hired, etc.).
*   **Dashboard**: Visual statistics of applications and profile views.

### 🏢 For Employers
*   **Company Profile**: Showcase company culture, website, and details.
*   **Job Management**: Create, edit, and manage job postings with rich text descriptions.
*   **Applicant Tracking System (ATS)**:
    *   View all applicants for a specific job.
    *   Review resumes and cover letters directly in the browser.
    *   Update applicant status (Shortlist, Interview, Hire, Reject).
*   **Analytics Dashboard**: Track active jobs, total applicants, and hiring pipeline stats.

## 🛠️ Tech Stack

### Frontend
*   **React (Vite)**: Fast and modern UI library.
*   **Tailwind CSS**: Utility-first styling for a responsive and premium design.
*   **Framer Motion**: Smooth animations and transitions.
*   **Axios**: API integration with interceptors for JWT handling.
*   **React Router**: Seamless client-side navigation.

### Backend
*   **Node.js & Express**: Robust RESTful API architecture.
*   **MongoDB (Atlas)**: NoSQL database for flexible data storage.
*   **Mongoose**: ODM for strict schema validation.
*   **JWT (JSON Web Tokens)**: Secure stateless authentication.
*   **Cloudinary**: Cloud storage for profile photos and resume PDFs.
*   **Multer**: Handling multipart/form-data for file uploads.

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
*   Node.js (v14+)
*   MongoDB installed locally or a MongoDB Atlas connection string.
*   Cloudinary Account (for file uploads).

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/job-portal.git
cd job-portal
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Frontend Setup
Navigate to the client directory and install dependencies:
```bash
cd ../client
npm install
```

Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000
```

## 🏃‍♂️ Running the Application

You need to run both the backend and frontend servers.

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```
*Server runs on http://localhost:5000*

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```
*Client runs on http://localhost:5173*

## 📁 Project Structure

```
├── client/                 # React Frontend
│   ├── src/
│   │   ├── api/            # Axios setup
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Auth & Global State
│   │   ├── pages/          # Application Pages
│   │   └── ...
│   └── ...
│
├── server/                 # Node.js Backend
│   ├── config/             # DB & Cloudinary Config
│   ├── controllers/        # Route Logic
│   ├── middleware/         # Auth & Upload Middleware
│   ├── models/             # Mongoose Schemas
│   ├── routes/             # API Routes
│   └── ...
└── README.md               # Project Documentation
```

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## 📄 License

This project is licensed under the MIT License.
