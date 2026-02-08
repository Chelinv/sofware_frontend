import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // 🔹 Obtener usuarios guardados
        const users = JSON.parse(localStorage.getItem("users")) || [];

        // 🔹 Buscar usuario
        const userFound = users.find(
            (u) => u.email === email && u.password === password
        );

        if (userFound) {
            // 🔐 Token simulado
            localStorage.setItem("token", "fake-jwt-token");
            localStorage.setItem("currentUser", JSON.stringify(userFound));
            navigate("/");
        } else {
            setError("Correo o contraseña incorrectos");
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

                            <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">
                                <i className="bi bi-box-arrow-in-right me-2"></i>
                                Iniciar sesión
                            </button>
                        </form>

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
