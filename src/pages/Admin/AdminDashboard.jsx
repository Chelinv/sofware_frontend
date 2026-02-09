import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../config/api";
import "./AdminDashboard.css";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsuarios: 0,
        totalEstudiantes: 0,
        totalDocentes: 0,
        totalAsignaturas: 0,
        totalMatriculas: 0,
        totalCalificaciones: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);

            // Obtener usuarios
            const usuariosRes = await api.get("/usuarios/");
            const usuarios = usuariosRes.data || [];

            // Obtener asignaturas
            const asignaturasRes = await api.get("/asignaturas/");
            const asignaturas = asignaturasRes.data || [];

            // Obtener matrículas
            const matriculasRes = await api.get("/matriculas/");
            const matriculas = matriculasRes.data || [];

            // Obtener calificaciones
            const calificacionesRes = await api.get("/calificaciones/");
            const calificaciones = calificacionesRes.data || [];

            setStats({
                totalUsuarios: usuarios.length,
                totalEstudiantes: usuarios.filter(u => u.rol === "Estudiante").length,
                totalDocentes: usuarios.filter(u => u.rol === "Docente").length,
                totalAsignaturas: asignaturas.length,
                totalMatriculas: matriculas.length,
                totalCalificaciones: calificaciones.length
            });
        } catch (error) {
            console.error("Error cargando estadísticas:", error);
        } finally {
            setLoading(false);
        }
    };

    const modules = [
        {
            title: 'Usuarios',
            description: 'Gestión de usuarios del sistema',
            icon: 'bi-people',
            link: '/usuarios',
            color: 'primary',
            stat: stats.totalUsuarios
        },
        {
            title: 'Asignaturas',
            description: 'Administración de materias',
            icon: 'bi-journal-bookmark',
            link: '/asignaturas',
            color: 'success',
            stat: stats.totalAsignaturas
        },
        {
            title: 'Inscripciones',
            description: 'Registro de estudiantes',
            icon: 'bi-pencil-square',
            link: '/inscripciones',
            color: 'info',
            stat: stats.totalMatriculas
        },
        {
            title: 'Calificaciones',
            description: 'Gestión de notas',
            icon: 'bi-clipboard-check',
            link: '/calificaciones',
            color: 'warning',
            stat: stats.totalCalificaciones
        },
        {
            title: 'Pagos',
            description: 'Administración financiera',
            icon: 'bi-credit-card',
            link: '/pagos',
            color: 'danger',
            stat: '-'
        },
    ];

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4 admin-dashboard">
            {/* Welcome Header */}
            <div className="welcome-header mb-4">
                <h2>
                    <i className="bi bi-speedometer2 me-2"></i>
                    Panel de Administración
                </h2>
                <p className="mb-0">Sistema de Gestión Educativa</p>
            </div>

            {/* Statistics Cards */}
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div className="card stat-card bg-primary text-white">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h3 className="mb-0">{stats.totalUsuarios}</h3>
                                    <p className="mb-0 small">Total Usuarios</p>
                                </div>
                                <i className="bi bi-people fs-1"></i>
                            </div>
                            <div className="mt-2 small">
                                <i className="bi bi-person-check me-1"></i>
                                {stats.totalEstudiantes} Estudiantes · {stats.totalDocentes} Docentes
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card stat-card bg-success text-white">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h3 className="mb-0">{stats.totalAsignaturas}</h3>
                                    <p className="mb-0 small">Asignaturas</p>
                                </div>
                                <i className="bi bi-journal-bookmark fs-1"></i>
                            </div>
                            <div className="mt-2 small">
                                <i className="bi bi-check-circle me-1"></i>
                                Materias activas
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card stat-card bg-info text-white">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h3 className="mb-0">{stats.totalMatriculas}</h3>
                                    <p className="mb-0 small">Inscripciones</p>
                                </div>
                                <i className="bi bi-pencil-square fs-1"></i>
                            </div>
                            <div className="mt-2 small">
                                <i className="bi bi-clipboard-data me-1"></i>
                                {stats.totalCalificaciones} Calificaciones registradas
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modules Grid */}
            <div className="mb-3">
                <h4>
                    <i className="bi bi-grid me-2"></i>
                    Módulos del Sistema
                </h4>
            </div>

            <div className="row g-4">
                {modules.map((module, index) => (
                    <div key={index} className="col-md-6 col-lg-4">
                        <Link to={module.link} className="text-decoration-none">
                            <div className={`card module-card h-100 border-${module.color}`}>
                                <div className="card-body text-center p-4">
                                    <div className={`module-icon text-${module.color} mb-3`}>
                                        <i className={`bi ${module.icon}`}></i>
                                    </div>
                                    <h5 className="card-title mb-2">{module.title}</h5>
                                    <p className="card-text text-muted small">{module.description}</p>
                                    <div className={`badge bg-${module.color} mt-2`}>
                                        {module.stat} registros
                                    </div>
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
        </div>
    );
};

export default AdminDashboard;
