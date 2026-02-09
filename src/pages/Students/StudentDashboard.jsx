import { useState, useEffect } from "react";
import api from "../../config/api";
import Swal from "sweetalert2";
import "./StudentDashboard.css";

const StudentDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));

            if (!currentUser || !currentUser.id) {
                Swal.fire("Error", "No se pudo obtener información del usuario", "error");
                return;
            }

            // Llamar al nuevo endpoint de dashboard
            const response = await api.get(`/estudiantes/${currentUser.id}/dashboard`);
            setDashboardData(response.data);
        } catch (error) {
            console.error("Error cargando dashboard:", error);
            Swal.fire("Error", "No se pudo cargar la información del dashboard", "error");
        } finally {
            setLoading(false);
        }
    };

    const getGradeColor = (calificacion) => {
        if (calificacion === null || calificacion === undefined) return "secondary";
        if (calificacion >= 90) return "success";
        if (calificacion >= 80) return "info";
        if (calificacion >= 70) return "warning";
        if (calificacion >= 60) return "primary";
        return "danger";
    };

    const getStatusBadge = (estado) => {
        const badges = {
            "Aprobado": "success",
            "Reprobado": "danger",
            "En Curso": "secondary"
        };
        return badges[estado] || "secondary";
    };

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

    if (!dashboardData) {
        return (
            <div className="container mt-4">
                <div className="alert alert-warning">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    No se pudo cargar la información del dashboard
                </div>
            </div>
        );
    }

    const { estudiante, materias_inscritas, resumen } = dashboardData;

    return (
        <div className="container mt-4 student-dashboard">
            {/* Welcome Header */}
            <div className="welcome-header mb-4">
                <h2>
                    <i className="bi bi-person-circle me-2 text-primary"></i>
                    Bienvenido, {estudiante.nombre}
                </h2>
                <p className="text-muted mb-0">
                    <i className="bi bi-envelope me-2"></i>
                    {estudiante.email}
                </p>
            </div>

            {/* Academic Summary */}
            <div className="row g-3 mb-4">
                <div className="col-md-3">
                    <div className="card summary-card bg-primary text-white">
                        <div className="card-body text-center">
                            <i className="bi bi-book fs-1 mb-2"></i>
                            <h3 className="mb-0">{resumen.total_materias}</h3>
                            <p className="mb-0 small">Total Materias</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card summary-card bg-success text-white">
                        <div className="card-body text-center">
                            <i className="bi bi-check-circle fs-1 mb-2"></i>
                            <h3 className="mb-0">{resumen.materias_aprobadas}</h3>
                            <p className="mb-0 small">Aprobadas</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card summary-card bg-danger text-white">
                        <div className="card-body text-center">
                            <i className="bi bi-x-circle fs-1 mb-2"></i>
                            <h3 className="mb-0">{resumen.materias_reprobadas}</h3>
                            <p className="mb-0 small">Reprobadas</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card summary-card bg-info text-white">
                        <div className="card-body text-center">
                            <i className="bi bi-graph-up fs-1 mb-2"></i>
                            <h3 className="mb-0">
                                {resumen.promedio_general !== null ? resumen.promedio_general.toFixed(2) : "N/A"}
                            </h3>
                            <p className="mb-0 small">Promedio General</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subjects and Grades */}
            <div className="mb-3">
                <h4>
                    <i className="bi bi-journal-bookmark me-2"></i>
                    Mis Materias y Calificaciones
                </h4>
            </div>

            {materias_inscritas.length === 0 ? (
                <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    No tienes materias inscritas actualmente.
                </div>
            ) : (
                <div className="row g-4">
                    {materias_inscritas.map((materia, index) => (
                        <div key={materia.asignatura_id} className="col-md-6 col-lg-4">
                            <div className="card h-100 subject-card shadow-sm">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <span className="badge bg-primary">{materia.codigo}</span>
                                        <span className={`badge bg-${getStatusBadge(materia.estado)}`}>
                                            {materia.estado}
                                        </span>
                                    </div>

                                    <h5 className="card-title">
                                        <i className="bi bi-book me-2 text-primary"></i>
                                        {materia.nombre}
                                    </h5>

                                    <div className="grade-display mt-3">
                                        {materia.calificacion !== null ? (
                                            <>
                                                <div className={`grade-badge bg-${getGradeColor(materia.calificacion)}`}>
                                                    {materia.calificacion.toFixed(1)}
                                                </div>
                                                <p className="text-muted small mb-0 mt-2">Calificación</p>
                                            </>
                                        ) : (
                                            <div className="text-center">
                                                <i className="bi bi-hourglass-split fs-2 text-muted"></i>
                                                <p className="text-muted small mb-0 mt-2">Sin calificación</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Additional Info */}
            {resumen.materias_en_curso > 0 && (
                <div className="alert alert-info mt-4">
                    <i className="bi bi-info-circle me-2"></i>
                    Tienes <strong>{resumen.materias_en_curso}</strong> materia(s) en curso sin calificación asignada.
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
