import { Link, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const isAuthenticated = !!currentUser;
    const userRole = currentUser?.rol?.toLowerCase() || '';
    const isHomePage = location.pathname === '/';

    const handleLogout = () => {
        Swal.fire({
            title: '¿Cerrar Sesión?',
            text: '¿Estás seguro que deseas cerrar sesión?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                localStorage.removeItem('currentUser');
                localStorage.removeItem('user');
                navigate('/login');
                Swal.fire({
                    icon: 'success',
                    title: 'Sesión Cerrada',
                    text: 'Has cerrado sesión exitosamente.',
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        });
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    <i className="bi bi-book me-2"></i>
                    SGIE - Sistema de Gestión
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                <i className="bi bi-house-door me-1"></i>
                                Inicio
                            </Link>
                        </li>

                        {isAuthenticated && (
                            <>
                                {/* Admin Menu */}
                                {userRole === "administrador" && (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/admin/dashboard">
                                                <i className="bi bi-speedometer2 me-1"></i>
                                                Dashboard
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/usuarios">
                                                <i className="bi bi-people me-1"></i>
                                                Usuarios
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/asignaturas">
                                                <i className="bi bi-journal-bookmark me-1"></i>
                                                Asignaturas
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/inscripciones">
                                                <i className="bi bi-pencil-square me-1"></i>
                                                Inscripciones
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/calificaciones">
                                                <i className="bi bi-clipboard-check me-1"></i>
                                                Calificaciones
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/pagos">
                                                <i className="bi bi-credit-card me-1"></i>
                                                Pagos
                                            </Link>
                                        </li>
                                    </>
                                )}

                                {/* Student Menu */}
                                {userRole === "estudiante" && (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/estudiante/dashboard">
                                                <i className="bi bi-person-circle me-1"></i>
                                                Mi Dashboard
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/inscripciones/crear">
                                                <i className="bi bi-pencil-square me-1"></i>
                                                Inscribirme en Materias
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/calificaciones/visualizar">
                                                <i className="bi bi-clipboard-check me-1"></i>
                                                Mis Calificaciones
                                            </Link>
                                        </li>
                                    </>
                                )}

                                {/* Teacher Menu */}
                                {userRole === "docente" && (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/calificaciones">
                                                <i className="bi bi-clipboard-check me-1"></i>
                                                Calificaciones
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/calificaciones/registrar">
                                                <i className="bi bi-pencil me-1"></i>
                                                Registrar Notas
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/asignaturas">
                                                <i className="bi bi-journal-bookmark me-1"></i>
                                                Asignaturas
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </>
                        )}
                    </ul>

                    <ul className="navbar-nav">
                        {isAuthenticated && !isHomePage ? (
                            <>
                                <li className="nav-item">
                                    <span className="nav-link">
                                        <i className="bi bi-person-circle me-1"></i>
                                        {currentUser?.nombre || 'Usuario'}
                                        <span className="badge bg-light text-primary ms-2">
                                            {currentUser?.rol || ''}
                                        </span>
                                    </span>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                                        <i className="bi bi-box-arrow-right me-1"></i>
                                        Cerrar Sesión
                                    </button>
                                </li>
                            </>
                        ) : !isAuthenticated && !isHomePage ? (
                            <li className="nav-item">
                                <Link className="btn btn-outline-light btn-sm" to="/login">
                                    <i className="bi bi-box-arrow-in-right me-1"></i>
                                    Iniciar Sesión
                                </Link>
                            </li>
                        ) : null}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
