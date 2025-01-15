import './App.css';
import './index.css';
import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { AuthProvider, AuthContext } from './components/AuthContext';

// Import components for routing
import Header from './components/HeaderMUI';
import Register from './components/Register';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Quiz from './components/Quiz';
import Footer from './components/Footer';
import WelcomeMessage from './components/WelcomeMessage';
import TimerComponent from './components/Timer';
import UserStats from './components/UserStats';
import UserProfile from './components/UserProfile';
import AdminMetadata from './components/AdminMetadata';
import AdminLesson from './components/AdminLesson';
import AdminExercise from './components/AdminExercise';
import AdminExams from './components/AdminExams';
import AdminUsers from './components/AdminUsers';
import LearningBoard from './components/LearningBoard';
import AdminLessonDraft from './components/AdminLessonDraft';


//protected routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />; //if not authenticated, redirect to login page
};

function App() {
  return (    
    <AuthProvider>
      <Router>
      <Header />        
      <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path='/register' element={<Register />} />
          <Route path ='/login' element ={<Login />} />
          <Route path='/dashboard' 
                 element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                  }
          />
          <Route path='/quiz/:unitid' 
                 element={
                  <ProtectedRoute>
                    <Quiz />
                  </ProtectedRoute>
                  }
          />
          <Route path='/stats' 
                 element={
                  <ProtectedRoute>
                    <UserStats />
                  </ProtectedRoute>
                  }
          />
          <Route path='/profile' 
                 element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                  }
          />
          <Route path='/admin-metadata' 
                 element={
                  <ProtectedRoute>
                    <AdminMetadata />
                  </ProtectedRoute>
                  }
          />
          <Route path='/admin-lessons' 
                 element={
                  <ProtectedRoute>
                    <AdminLesson />
                  </ProtectedRoute>
                  }
          />
          <Route path='/admin-exercise' 
                 element={
                  <ProtectedRoute>
                    <AdminExercise />
                  </ProtectedRoute>
                  }
          />
          <Route path='/admin-exams' 
                 element={
                  <ProtectedRoute>
                    <AdminExams />
                  </ProtectedRoute>
                  }
          />
          <Route path='/admin-users' 
                 element={
                  <ProtectedRoute>
                    <AdminUsers />
                  </ProtectedRoute>
                  }
          />
          <Route path='/learningboard/:unitid' 
                 element={
                  <ProtectedRoute>
                    <LearningBoard />
                  </ProtectedRoute>
                  }
          />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
