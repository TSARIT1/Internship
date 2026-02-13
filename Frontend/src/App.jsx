import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Contact from './pages/Contact';
import InternshipDetails from './pages/InternshipDetails';
import Enroll from './pages/Enroll';
import EnrollSuccess from './pages/EnrollSuccess';

import DataScience from './pages/DataScience';
import MachineLearning from './pages/MachineLearning';
import AI from './pages/AI';
import MernStack from './pages/MernStack';
import DevOps from './pages/DevOps';
import JavaFullStack from './pages/JavaFullStack';
import PythonProgramming from './pages/PythonProgramming';
import AWSCloudComputing from './pages/AWSCloudComputing';
import CyberSecurity from './pages/CyberSecurity';
import Webinars from './pages/Webinars';

import AdminLogin from './pages/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminCourses from './pages/AdminCourses';
import AdminWebinars from './pages/AdminWebinars';
import AdminTestimonials from './pages/AdminTestimonials';
import AdminStudents from './pages/AdminStudents';
import AdminPayments from './pages/AdminPayments';
import AdminPricing from './pages/AdminPricing';

import AdminVideoTestimonials from './pages/AdminVideoTestimonials';
import AdminCourseContent from './pages/AdminCourseContent';
import AdminHackathons from './pages/AdminHackathons';



import StudentLayout from './layouts/StudentLayout';
import StudentProtectedRoute from './components/StudentProtectedRoute';
import StudentDashboardHome from './pages/student/StudentDashboardHome';
import StudentWebinars from './pages/student/StudentWebinars';
import StudentRegistrations from './pages/student/StudentRegistrations';
import StudentTestimonials from './pages/student/StudentTestimonials';
import StudentCourses from './pages/student/StudentCourses';
import StudentCourseView from './pages/student/StudentCourseView';
import StudentProfile from './pages/student/StudentProfile';
import StudentHackathons from './pages/student/StudentHackathons';

import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import ScrollToTop from './components/ScrollToTop';





function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/data-science" element={<DataScience />} />
        <Route path="/machine-learning" element={<MachineLearning />} />
        <Route path="/ai" element={<AI />} />
        <Route path="/mern-stack" element={<MernStack />} />
        <Route path="/devops" element={<DevOps />} />
        <Route path="/java-full-stack" element={<JavaFullStack />} />
        <Route path="/python-programming" element={<PythonProgramming />} />
        <Route path="/aws-cloud-computing" element={<AWSCloudComputing />} />
        <Route path="/cyber-security" element={<CyberSecurity />} />
        <Route path="/internship/:id" element={<InternshipDetails />} />
        <Route path="/enroll" element={<Enroll />} />
        <Route path="/enroll-success" element={<ProtectedRoute><EnrollSuccess /></ProtectedRoute>} />
        <Route path="/webinars" element={<Webinars />} />

        {/* Auth Routes */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />

        <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="hackathons" element={<AdminHackathons />} />
          <Route path="webinars" element={<AdminWebinars />} />
          <Route path="video-testimonials" element={<AdminVideoTestimonials />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="pricing" element={<AdminPricing />} />
          <Route path="course-content" element={<AdminCourseContent />} />
        </Route>
        {/* Student Routes */}
        <Route path="/student/course/:courseName" element={<StudentProtectedRoute><StudentCourseView /></StudentProtectedRoute>} />
        <Route path="/studentdashboard" element={<StudentProtectedRoute><StudentLayout /></StudentProtectedRoute>}>
          <Route index element={<StudentDashboardHome />} />
          <Route path="courses" element={<StudentCourses />} />
          <Route path="webinars" element={<StudentWebinars />} />
          <Route path="my-registrations" element={<StudentRegistrations />} />
          <Route path="testimonials" element={<StudentTestimonials />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="hackathons" element={<StudentHackathons />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
