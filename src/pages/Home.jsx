import { Link } from 'react-router-dom';

const Home = () => {
    const isAuthenticated = !!localStorage.getItem('token');

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

            {!isAuthenticated ? (
                <div className="row justify-content-center">
                    <div className="col-md-6 text-center">
                        <div className="card shadow">
                            <div className="card-body p-5">
                                <i className="bi bi-lock display-1 text-primary mb-4"></i>
                                <h3 className="mb-3">Acceso Restringido</h3>
                                <p className="text-muted mb-4">
                                    Por favor, inicia sesión para acceder a las funcionalidades del sistema.
                                </p>
                                <Link to="/login" className="btn btn-primary btn-lg">
                                    <i className="bi bi-box-arrow-in-right me-2"></i>
                                    Iniciar Sesión
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
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
                </>
            )}
        </div>
    );
};

export default Home;
