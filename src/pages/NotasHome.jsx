import { Link } from 'react-router-dom';

const NotasHome = () => {
    const isAuthenticated = !!localStorage.getItem('token');

    const modules = [
        {
            title: 'Registrar Notas',
            description: 'Ingreso y actualización de calificaciones de estudiantes',
            icon: 'bi-pencil-square',
            link: '/calificaciones/registrar',
            color: 'primary',
        },
        {
            title: 'Ver Notas',
            description: 'Consultar calificaciones registradas',
            icon: 'bi-eye',
            link: '/calificaciones/visualizar',
            color: 'success',
        }
    ];

    return (
        <div className="container">
            <div className="row mb-5">
                <div className="col-12 text-center">
                    <h1 className="display-4 mb-3">
                        <i className="bi bi-journal-check me-3"></i>
                        Gestión de Notas
                    </h1>
                    <p className="lead text-muted">
                        Módulo de registro y consulta de calificaciones
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
                                    Debes iniciar sesión para acceder a este módulo.
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
                                Opciones Disponibles
                            </h2>
                        </div>
                    </div>

                    <div className="row g-4">
                        {modules.map((module, index) => (
                            <div key={index} className="col-md-6">
                                <Link to={module.link} className="text-decoration-none">
                                    <div className={`card h-100 shadow-sm border-${module.color}`}>
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
                                                Acceder
                                            </small>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default NotasHome;
