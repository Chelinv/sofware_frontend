import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
    // Always show landing page, regardless of authentication status
    // Users must navigate to specific modules to access features

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Sistema de Gestión Educativa
                    </h1>
                    <p className="hero-subtitle">
                        Plataforma integral para la administración académica moderna
                    </p>
                    <div className="hero-buttons">
                        <Link to="/login" className="btn btn-primary btn-lg">
                            <i className="bi bi-box-arrow-in-right me-2"></i>
                            Iniciar Sesión
                        </Link>
                        <Link to="/register" className="btn btn-outline-light btn-lg">
                            <i className="bi bi-person-plus me-2"></i>
                            Registrarse
                        </Link>
                    </div>
                </div>
                <div className="hero-decoration">
                    <i className="bi bi-mortarboard-fill"></i>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">Funcionalidades por Rol</h2>
                    <div className="features-grid">
                        {/* Estudiantes */}
                        <div className="feature-card">
                            <div className="feature-icon student">
                                <i className="bi bi-person-circle"></i>
                            </div>
                            <h3>Estudiantes</h3>
                            <ul className="feature-list">
                                <li><i className="bi bi-check-circle-fill"></i> Ver materias inscritas</li>
                                <li><i className="bi bi-check-circle-fill"></i> Consultar calificaciones</li>
                                <li><i className="bi bi-check-circle-fill"></i> Seguimiento académico</li>
                            </ul>
                        </div>

                        {/* Docentes */}
                        <div className="feature-card">
                            <div className="feature-icon teacher">
                                <i className="bi bi-person-badge"></i>
                            </div>
                            <h3>Docentes</h3>
                            <ul className="feature-list">
                                <li><i className="bi bi-check-circle-fill"></i> Gestión de calificaciones</li>
                                <li><i className="bi bi-check-circle-fill"></i> Registro de notas</li>
                                <li><i className="bi bi-check-circle-fill"></i> Reportes académicos</li>
                            </ul>
                        </div>

                        {/* Administradores */}
                        <div className="feature-card">
                            <div className="feature-icon admin">
                                <i className="bi bi-shield-check"></i>
                            </div>
                            <h3>Administradores</h3>
                            <ul className="feature-list">
                                <li><i className="bi bi-check-circle-fill"></i> Gestión de usuarios</li>
                                <li><i className="bi bi-check-circle-fill"></i> Administración de materias</li>
                                <li><i className="bi bi-check-circle-fill"></i> Control de inscripciones</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>¿Listo para comenzar?</h2>
                    <p>Inicia sesión para acceder a todas las funcionalidades del sistema</p>
                    <Link to="/login" className="btn btn-light btn-lg">
                        <i className="bi bi-arrow-right-circle me-2"></i>
                        Acceder al Sistema
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="home-footer">
                <div className="container">
                    <p className="mb-0">
                        <i className="bi bi-mortarboard me-2"></i>
                        Sistema de Gestión Educativa &copy; 2026
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
