# Gibigubae Website - Frontend

## 📋 Overview

Gibigubae Website Frontend is a comprehensive attendance management system built with React. The application provides separate portals for students and administrators, enabling efficient course enrollment, attendance tracking, and analytics.

## ✨ Key Features

### 👨‍🎓 Student Portal

- **Course Management**: View enrolled courses and browse available courses
- **Attendance Tracking**: Real-time attendance status and history
- **Course Details**: Access session schedules and attendance records
- **Responsive Design**: Fully mobile-responsive interface

### 👨‍💼 Admin Portal

- **Dashboard Analytics**: Comprehensive attendance overview with charts and KPIs
- **Student Management**: Create, view, edit, and delete student records
- **Course Management**: Manage courses, sessions, and enrollments
- **Enrollment Manager**: Easy course enrollment/unenrollment interface
- **Attendance Tracking**: Mark student attendance for each session
- **Advanced Analytics**:
  - Daily, weekly, and monthly attendance trends
  - Course-specific insights
  - Student performance metrics
  - Department-wise analytics
  - At-risk student identification

### 🎨 UI/UX Highlights

- **Fully Responsive**: Optimized for mobile, tablet, and desktop
- **Mobile-First Design**: Card-based layouts on mobile for better readability
- **Touch-Friendly**: Minimum 44px touch targets on mobile devices
- **Smooth Animations**: Polished user experience with transitions
- **Accessible**: Proper color contrast and semantic HTML

## 🛠️ Technology Stack

### Core

- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Vite** - Build tool and dev server

### State Management & Data Fetching

- **React Query (@tanstack/react-query)** - Server state management
- **Axios** - HTTP client

### UI & Styling

- **CSS3** - Custom styling
- **Lucide React** - Icon library
- **Chart.js & Recharts** - Data visualization
- **SweetAlert2** - Beautiful alerts and modals

### Development Tools

- **ESLint** - Code linting
- **PostCSS** - CSS processing

## 📸 Screenshots

### Admin Dashboard

<img width="1898" height="900" alt="image" src="https://github.com/user-attachments/assets/049b1d71-5ea1-4f1d-b2fa-59f20d24fbb3" />

### Mobile View

<img width="419" height="720" alt="image" src="https://github.com/user-attachments/assets/a05d5933-4a03-4e43-8f72-b0eebe28b030" />

### Attendance Table
<img width="1910" height="911" alt="image" src="https://github.com/user-attachments/assets/b13035d2-2410-433d-8456-65ba0bb446e9" />

### Analytics Page

<img width="1915" height="902" alt="image" src="https://github.com/user-attachments/assets/c98cfb0b-4ed8-4b6a-8559-ac0f992934f8" />
<img width="1900" height="903" alt="image" src="https://github.com/user-attachments/assets/32c69210-eed4-47c3-8554-81e4ef773192" />
<img width="1919" height="903" alt="image" src="https://github.com/user-attachments/assets/f858eb04-8b69-4684-add5-53925e34e027" />
<img width="1916" height="909" alt="image" src="https://github.com/user-attachments/assets/ad073445-282f-4da4-85cc-1f7b06db4df3" />

```

## 📱 Mobile Responsiveness

The application is fully responsive with specific optimizations:

- **StudentList**: Card-based layout on mobile (< 768px)
- **EnrollmentManager**: Stacked panels and touch-friendly controls
- **Analytics**:
  - Single-column layouts on mobile
  - Optimized chart heights
  - Stacked filters and controls
- **Admin Sidebar**: Auto-collapsed on mobile/tablet (< 1024px)

## 🏗️ Project Structure

```

  ```
  src/
  ├── Components/        # Reusable UI components
  ├── Pages/
  │   ├── Admin/        # Admin portal pages
  │   └── Students/     # Student portal pages
  ├── hooks/
  ├── api/         # Custom React hooks
  ├── styles/           # CSS stylesheets
  └── App.jsx           # Main app component
  ```

## 🔐 Authentication

The application uses cookie-based authentication with the following routes:

- `/login` - Student/Admin login
- `/signup` - Student registration
- `/admin/*` - Protected admin routes
- `/student/*` - Protected student routes

## 📊 Analytics Features

- Daily attendance overview with KPIs
- 7-day attendance trends
- Course-specific analytics
- Student performance tracking
- Department-wise insights
- At-risk student identification
- Monthly summaries and comparisons

