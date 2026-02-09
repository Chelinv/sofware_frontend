import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const isAuthenticated = !!currentUser;

    // Si el usuario está autenticado, mostrar dashboard con módulos
    if (isAuthenticated) {
        const modules = [
            {
                title: 'Usuarios',
                description: 'Gestión de usuarios del sistema',
                icon: 'bi-people',
                link: '/usuarios',
                color: 'primary',
            },
            {
                title: 'Asignaturas',
                description: 'Administración de materias y grupos',
                icon: 'bi-journal-bookmark',
                link: '/asignaturas',
                color: 'success',
            },
            {
                title: 'Inscripciones',
                description: 'Registro de estudiantes en asignaturas',
                icon: 'bi-pencil-square',
                link: '/inscripciones',
                color: 'info',
            },
            {
                title: 'Calificaciones',
                description: 'Gestión de notas y reportes académicos',
                icon: 'bi-clipboard-check',
                link: '/calificaciones',
                color: 'warning',
            },
            {
                title: 'Pagos',
                description: 'Administración financiera y reportes',
                icon: 'bi-credit-card',
                link: '/pagos',
                color: 'danger',
            },
        ];

        return (
            <div className="container">
                <div className="row mb-5">
                    <div className="col-12 text-center">
                        <h1 className="display-4 mb-3">
                            <i className="bi bi-mortarboard me-3"></i>
                            Bienvenido al SGIE
                        </h1>
                        <p className="lead text-muted">
                            Sistema de Gestión de Institución Educativa
                        </p>
                        <hr className="my-4" />
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-12">
                        <h2 className="mb-4">
                            <i className="bi bi-grid me-2"></i>
                            Módulos del Sistema
                        </h2>
                    </div>
                </div>

                <div className="row g-4">
                    {modules.map((module, index) => (
                        <div key={index} className="col-md-6 col-lg-4">
                            <Link to={module.link} className="text-decoration-none">
                                <div className={`card h-100 shadow-sm hover-shadow border-${module.color}`}>
                                    <div className="card-body text-center p-4">
                                        <div className={`display-4 text-${module.color} mb-3`}>
                                            <i className={`bi ${module.icon}`}></i>
                                        </div>
                                        <h5 className="card-title mb-2">{module.title}</h5>
                                        <p className="card-text text-muted">{module.description}</p>
                                    </div>
                                    <div className={`card-footer bg-${module.color} bg-opacity-10 text-center`}>
                                        <small className={`text-${module.color}`}>
                                            <i className="bi bi-arrow-right-circle me-1"></i>
                                            Acceder al módulo
                                        </small>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="row mt-5">
                    <div className="col-12">
                        <div className="alert alert-info" role="alert">
                            <h5 className="alert-heading">
                                <i className="bi bi-info-circle me-2"></i>
                                Información del Sistema
                            </h5>
                            <p className="mb-0">
                                Este sistema permite la gestión integral de una institución educativa,
                                incluyendo usuarios, asignaturas, inscripciones, calificaciones y finanzas.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Si no está autenticado, mostrar landing page pública
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
