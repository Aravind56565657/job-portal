# Job Listing Portal

A full-stack Job Listing application built with React, Node.js, Express, and MongoDB.

## Features
- **Authentication**: JWT-based auth with Google Sign-In support.
- **Roles**: Job Seeker and Employer.
- **Jobs**: Post, Edit, Delete, Search, and Apply for jobs.
- **Dashboard**: Track applications and manage listings.

## Prerequisites
- Node.js installed.
- MongoDB installed locally or a MongoDB Atlas account (see `mongodb_setup_guide.md`).

## Installation

### 1. Backend Setup
```bash
cd server
npm install
```
*   Create a `.env` file in `server/` (see `env_setup_guide.md`).

### 2. Frontend Setup
```bash
cd client
npm install
```

## Running the Project

You need to run **both** the backend and frontend servers simultaneously in separate terminals.

### Terminal 1 (Backend)
```bash
cd server
npm run dev
```
*Runs on `http://localhost:5000`*

### Terminal 2 (Frontend)
```bash
cd client
npm run dev
```
*Runs on `http://localhost:5173`*

## Build for Production
### Backend
```bash
cd server
npm start
```

### Frontend
```bash
cd client
npm run build
```
The output will be in `client/dist`.
