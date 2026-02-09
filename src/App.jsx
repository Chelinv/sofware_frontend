import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserList from './pages/Users/UserList';
import SubjectList from './pages/Subjects/SubjectList';
import EnrollmentList from './pages/Enrollments/EnrollmentList';
import EnrollmentForm from './pages/Enrollments/EnrollmentForm';
import GradeList from './pages/Grades/GradeList';
import GradeBook from './pages/Grades/GradeBook';
import NotasHome from './pages/NotasHome';
import PaymentList from './pages/Payments/PaymentList';
import StudentDashboard from './pages/Students/StudentDashboard';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        {/* Protected Routes - Require Authentication */}
        <Route path="usuarios" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
        <Route path="asignaturas" element={<ProtectedRoute><SubjectList /></ProtectedRoute>} />
        <Route path="inscripciones" element={<ProtectedRoute><EnrollmentList /></ProtectedRoute>} />
        <Route path="inscripciones/crear" element={<ProtectedRoute><EnrollmentForm /></ProtectedRoute>} />
        <Route path="calificaciones" element={<ProtectedRoute><NotasHome /></ProtectedRoute>} />
        <Route path="calificaciones/registrar" element={<ProtectedRoute><GradeBook /></ProtectedRoute>} />
        <Route path="calificaciones/visualizar" element={<ProtectedRoute><GradeList /></ProtectedRoute>} />
        <Route path="pagos" element={<ProtectedRoute><PaymentList /></ProtectedRoute>} />
        <Route path="estudiante/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
        <Route path="estudiante/mis-materias" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

export default App;
