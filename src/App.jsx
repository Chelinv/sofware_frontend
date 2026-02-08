import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserList from './pages/Users/UserList';
import SubjectList from './pages/Subjects/SubjectList';
import EnrollmentList from './pages/Enrollments/EnrollmentList';
import GradeList from './pages/Grades/GradeList';
import PaymentList from './pages/Payments/PaymentList';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="usuarios" element={<UserList />} />
        <Route path="asignaturas" element={<SubjectList />} />
        <Route path="inscripciones" element={<EnrollmentList />} />
        <Route path="calificaciones" element={<GradeList />} />
        <Route path="pagos" element={<PaymentList />} />
      </Route>
    </Routes>
  );
}

export default App;
