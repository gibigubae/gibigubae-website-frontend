# Gibigubae Website - Frontend

![Project Banner]()

<!-- Add your project banner/screenshot here -->

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

![Admin Dashboard]()

<!-- Add admin dashboard screenshot here -->

### Mobile View

![Mobile Responsive]()

<!-- Add mobile view screenshot here -->

### Analytics Page

![Analytics]()

<!-- Add analytics screenshot here -->

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/gibigubae-website-frontend.git
cd gibigubae-website-frontend
```

2. Install dependencies

```bash
npm install
```

3. Create environment file

```bash
# Create .env file in root directory
VITE_API_URL=your_backend_api_url
```

4. Start development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
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
src/
├── Components/        # Reusable UI components
├── Pages/
│   ├── Admin/        # Admin portal pages
│   └── Students/     # Student portal pages
├── hooks/            # Custom React hooks
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

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

**Leul** - Developer

## 🙏 Acknowledgments

- Built with React and modern web technologies
- Icons by Lucide React
- Charts powered by Chart.js and Recharts
