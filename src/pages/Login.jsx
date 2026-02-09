import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import Swal from "sweetalert2";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", {
                email,
                password
            });

            // Guardar token y datos del usuario
            localStorage.setItem("token", "fake-jwt-token");
            localStorage.setItem("currentUser", JSON.stringify(response.data));


            Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: `Hola ${response.data.nombre}`,
                timer: 1500,
                showConfirmButton: false
            });

            // Redirigir según el rol del usuario
            const rol = response.data.rol.toLowerCase();

            switch (rol) {
                case 'administrador':
                    // Admin tiene acceso a todo, va al home/dashboard
                    navigate("/");
                    break;
                case 'docente':
                    navigate("/calificaciones");
                    break;
                case 'estudiante':
                    // Estudiante ve solo sus inscripciones
                    navigate("/inscripciones");
                    break;
                case 'padre':
                    navigate("/pagos");
                    break;
                default:
                    navigate("/");
            }

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || "Correo o contraseña incorrectos");
            Swal.fire({
                icon: 'error',
                title: 'Error de autenticación',
                text: err.response?.data?.detail || "Correo o contraseña incorrectos",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
            <div className="col-md-5 col-lg-4">
                <div className="card shadow-lg border-0">
                    <div className="card-body p-5">
                        <div className="text-center mb-4">
                            <i className="bi bi-mortarboard-fill text-primary display-3"></i>
                            <h3 className="mt-3 fw-bold">SGIE</h3>
                            <p className="text-muted">Sistema de Gestión Educativa</p>
                        </div>

                        {error && (
                            <div className="alert alert-danger text-center py-2">
                                <i className="bi bi-exclamation-circle me-2"></i>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Correo electrónico</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bi bi-envelope"></i>
                                    </span>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label">Contraseña</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bi bi-lock"></i>
                                    </span>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold" disabled={loading}>
                                <i className="bi bi-box-arrow-in-right me-2"></i>
                                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                            </button>
                        </form>

                        <div className="text-center mt-3">
                            <Link to="/register" className="text-primary text-decoration-none">
                                <i className="bi bi-person-plus me-1"></i>
                                ¿No tienes cuenta? Crear cuenta
                            </Link>
                        </div>

                        <div className="text-center mt-4 text-muted" style={{ fontSize: "0.9rem" }}>
                            © {new Date().getFullYear()} SGIE · Acceso seguro
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
