import { useEffect, useState } from "react";
import api from "../../api/api";
import Swal from "sweetalert2";

const GradeList = () => {
    const [calificaciones, setCalificaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Get current user
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const userRole = currentUser.rol?.toLowerCase() || "";

    useEffect(() => {
        cargarCalificaciones();
    }, []);

    const cargarCalificaciones = async () => {
        try {
            setLoading(true);

            // Load all grades
            const response = await api.get("/calificaciones/");

            // If student, filter only their grades
            if (userRole === "estudiante") {
                const misCalificaciones = response.data.filter(
                    (calif) => calif.estudiante_id === currentUser.id
                );
                setCalificaciones(misCalificaciones);
            } else {
                // Docente/Admin see all grades
                setCalificaciones(response.data);
            }
        } catch (err) {
            console.error("Error al cargar calificaciones:", err);
            setError("Error al cargar las calificaciones");
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudieron cargar las calificaciones",
            });
        } finally {
            setLoading(false);
        }
    };

    const getBadgeColor = (calificacion) => {
        if (calificacion >= 90) return "success";
        if (calificacion >= 70) return "primary";
        if (calificacion >= 60) return "warning";
        return "danger";
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando calificaciones...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h3 className="mb-4">
                <i className="bi bi-clipboard-check me-2"></i>
                {userRole === "estudiante" ? "Mis Calificaciones" : "Gestión de Calificaciones"}
            </h3>

            {error && <div className="alert alert-danger">{error}</div>}

            {calificaciones.length === 0 ? (
                <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    {userRole === "estudiante"
                        ? "No tienes calificaciones registradas en este momento."
                        : "No hay calificaciones registradas."}
                </div>
            ) : (
                <div className="card shadow-sm">
                    <div className="card-header bg-primary text-white">
                        <h5 className="mb-0">
                            <i className="bi bi-list-ul me-2"></i>
                            {userRole === "estudiante" ? "Mis Notas" : "Todas las Calificaciones"}
                        </h5>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover table-bordered">
                                <thead className="table-light">
                                    <tr>
                                        {userRole !== "estudiante" && <th>ID Estudiante</th>}
                                        <th>ID Asignatura</th>
                                        <th>Calificación</th>
                                        <th>Fecha Evaluación</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {calificaciones.map((calif, index) => (
                                        <tr key={calif.id || index}>
                                            {userRole !== "estudiante" && (
                                                <td>{calif.estudiante_id}</td>
                                            )}
                                            <td>
                                                <i className="bi bi-journal-bookmark me-1 text-primary"></i>
                                                {calif.asignatura_id}
                                            </td>
                                            <td>
                                                <span className={`badge bg-${getBadgeColor(calif.calificacion)} fs-6`}>
                                                    {calif.calificacion}/100
                                                </span>
                                            </td>
                                            <td>
                                                <i className="bi bi-calendar-event me-1"></i>
                                                {calif.fecha_evaluacion}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Statistics for students */}
                        {userRole === "estudiante" && calificaciones.length > 0 && (
                            <div className="mt-4">
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="card bg-light">
                                            <div className="card-body text-center">
                                                <h6 className="text-muted">Promedio General</h6>
                                                <h3 className="mb-0">
                                                    {(calificaciones.reduce((sum, c) => sum + c.calificacion, 0) / calificaciones.length).toFixed(2)}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="card bg-light">
                                            <div className="card-body text-center">
                                                <h6 className="text-muted">Nota Más Alta</h6>
                                                <h3 className="mb-0 text-success">
                                                    {Math.max(...calificaciones.map(c => c.calificacion))}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="card bg-light">
                                            <div className="card-body text-center">
                                                <h6 className="text-muted">Nota Más Baja</h6>
                                                <h3 className="mb-0 text-danger">
                                                    {Math.min(...calificaciones.map(c => c.calificacion))}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Info Alert */}
            <div className="mt-4">
                <div className="alert alert-secondary">
                    <h6>
                        <i className="bi bi-info-circle me-2"></i>
                        Información
                    </h6>
                    <p className="mb-0">
                        {userRole === "estudiante"
                            ? "Aquí puedes ver todas tus calificaciones. Para consultas sobre tus notas, contacta a tu docente."
                            : "Aquí puedes visualizar todas las calificaciones del sistema."}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GradeList;
