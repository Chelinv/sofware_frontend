import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api"; // Import the configured axios instance
import Swal from "sweetalert2";

const Register = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        password: "",
        rol: "Estudiante" // Default role
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await api.post("/usuarios/", formData);

            Swal.fire({
                icon: 'success',
                title: '¡Registro exitoso!',
                text: 'Ahora puedes iniciar sesión con tu cuenta.',
            });

            navigate("/login");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || "Error al registrar usuario");
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.response?.data?.detail || "Error al registrar usuario",
            });
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
            <div className="col-md-5 col-lg-4">
                <div className="card shadow-lg border-0">
                    <div className="card-body p-5">
                        <div className="text-center mb-4">
                            <i className="bi bi-person-plus-fill text-primary display-3"></i>
                            <h3 className="mt-3 fw-bold">Crear Cuenta</h3>
                            <p className="text-muted">Únete al Sistema de Gestión Educativa</p>
                        </div>

                        {error && (
                            <div className="alert alert-danger text-center py-2">
                                <i className="bi bi-exclamation-circle me-2"></i>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Nombre Completo</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bi bi-person"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Correo electrónico</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bi bi-envelope"></i>
                                    </span>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Contraseña</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bi bi-lock"></i>
                                    </span>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label">Rol</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bi bi-briefcase"></i>
                                    </span>
                                    <select
                                        className="form-select"
                                        name="rol"
                                        value={formData.rol}
                                        onChange={handleChange}
                                    >
                                        <option value="Estudiante">Estudiante</option>
                                        <option value="Docente">Docente</option>

                                        <option value="Administrador">Administrador</option>
                                    </select>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">
                                <i className="bi bi-check-circle me-2"></i>
                                Registrarse
                            </button>
                        </form>

                        <div className="text-center mt-4 text-muted" style={{ fontSize: "0.9rem" }}>
                            ¿Ya tienes cuenta? <Link to="/login" className="text-primary text-decoration-none fw-semibold">Inicia sesión aquí</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
