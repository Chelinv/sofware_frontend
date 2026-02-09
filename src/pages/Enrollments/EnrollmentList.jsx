import { Link } from 'react-router-dom';

const EnrollmentList = () => {
    // Get current user to check role
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const userRole = currentUser.rol?.toLowerCase() || "";

    // Check if user can create enrollments (admin or padre)
    const canCreateEnrollment = userRole === "administrador" || userRole === "padre";

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>
                    <i className="bi bi-pencil-square me-2"></i>
                    Gestión de Inscripciones
                </h3>

                {canCreateEnrollment && (
                    <Link to="/inscripciones/crear" className="btn btn-primary">
                        <i className="bi bi-plus-circle me-2"></i>
                        Nueva Inscripción
                    </Link>
                )}
            </div>

            {!canCreateEnrollment && (
                <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    <strong>Información:</strong> Solo administradores y padres pueden crear inscripciones.
                </div>
            )}

            <div className="alert alert-secondary">
                <h5>
                    <i className="bi bi-info-circle me-2"></i>
                    Módulo de Inscripciones
                </h5>
                <p className="mb-2">
                    <strong>Funcionalidad disponible:</strong>
                </p>
                <ul className="mb-0">
                    <li>
                        <strong>Administradores:</strong> Pueden crear nuevas inscripciones asignando materias a estudiantes
                    </li>
                    <li>
                        <strong>Estudiantes:</strong> Pueden ver sus inscripciones en el módulo de calificaciones
                    </li>
                    <li>
                        <strong>Docentes:</strong> Pueden ver las inscripciones al registrar calificaciones
                    </li>
                </ul>
            </div>

            {canCreateEnrollment && (
                <div className="card shadow-sm">
                    <div className="card-body text-center p-5">
                        <i className="bi bi-clipboard-check display-1 text-primary mb-4"></i>
                        <h4 className="mb-3">Crear Nueva Inscripción</h4>
                        <p className="text-muted mb-4">
                            Asigna materias a un estudiante para que pueda ser calificado por los docentes.
                        </p>
                        <Link to="/inscripciones/crear" className="btn btn-primary btn-lg">
                            <i className="bi bi-plus-circle me-2"></i>
                            Ir al Formulario de Inscripción
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnrollmentList;
