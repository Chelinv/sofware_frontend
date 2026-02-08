import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Toast from "../ui/Toast";

const Sidebar = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState("");

  const logout = () => {
    const confirmLogout = window.confirm("¿Deseas cerrar sesión?");
    if (!confirmLogout) return;

    localStorage.removeItem("token");
    setToast("Sesión cerrada correctamente");

    setTimeout(() => {
      navigate("/login");
    }, 1200);
  };

  return (
    <>
      <aside className="sidebar">
        <h2>SGIE</h2>

        <Link to="/">Inicio</Link>
        <Link to="/usuarios">Usuarios</Link>
        <Link to="/asignaturas">Asignaturas</Link>
        <Link to="/inscripciones">Inscripciones</Link>
        <Link to="/calificaciones">Calificaciones</Link>
        <Link to="/pagos">Pagos</Link>

        <hr style={{ margin: "20px 0", opacity: 0.3 }} />

        <button onClick={logout} style={{ width: "100%" }}>
          Cerrar Sesión
        </button>
      </aside>

      <Toast message={toast} />
    </>
  );
};

export default Sidebar;
