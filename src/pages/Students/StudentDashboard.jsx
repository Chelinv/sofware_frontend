import { useState, useEffect } from "react";
import api from "../../config/api";
import Swal from "sweetalert2";

const StudentDashboard = () => {
    const [enrolledSubjects, setEnrolledSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [studentInfo, setStudentInfo] = useState(null);

    useEffect(() => {
        fetchEnrolledSubjects();
    }, []);

    const fetchEnrolledSubjects = async () => {
        try {
            setLoading(true);
            const user = JSON.parse(localStorage.getItem("user"));

            if (!user || !user.id) {
                Swal.fire("Error", "No se pudo obtener información del usuario", "error");
                return;
            }

            setStudentInfo(user);

            // Obtener todas las matrículas
            const matriculasRes = await api.get("/matriculas");
            const allMatriculas = matriculasRes.data || [];

            // Filtrar matrículas del estudiante actual
            const myMatriculas = allMatriculas.filter(m => m.estudiante_id === user.id);

            // Obtener todas las asignaturas
            const asignaturasRes = await api.get("/asignaturas");
            const allAsignaturas = asignaturasRes.data || [];

            // Crear mapa de asignaturas por ID
            const asignaturasMap = {};
            allAsignaturas.forEach(asig => {
                asignaturasMap[asig.id || asig._id] = asig;
            });

            // Enriquecer matrículas con información de asignaturas
            const enrichedSubjects = [];
            myMatriculas.forEach(matricula => {
                (matricula.asignatura_ids || []).forEach(asigId => {
                    const asignatura = asignaturasMap[asigId];
                    if (asignatura) {
                        enrichedSubjects.push({
                            id: asigId,
                            nombre: asignatura.nombre,
                            codigo: asignatura.codigo,
                            fecha_matricula: matricula.fecha_matricula,
                            matricula_id: matricula.id
                        });
                    }
                });
            });

            setEnrolledSubjects(enrichedSubjects);
        } catch (error) {
            console.error("Error cargando materias:", error);
            Swal.fire("Error", "No se pudieron cargar las materias inscritas", "error");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando materias inscritas...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2>
                        <i className="bi bi-book me-2 text-primary"></i>
                        Mis Materias
                    </h2>
                    {studentInfo && (
                        <p className="text-muted mb-0">
                            <i className="bi bi-person-circle me-2"></i>
                            {studentInfo.nombre || studentInfo.email}
                        </p>
                    )}
                </div>
                <div className="badge bg-primary fs-5">
                    {enrolledSubjects.length} {enrolledSubjects.length === 1 ? 'Materia' : 'Materias'}
                </div>
            </div>

            {/* Subjects Grid */}
            {enrolledSubjects.length === 0 ? (
                <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    No tienes materias inscritas actualmente.
                </div>
            ) : (
                <div className="row g-4">
                    {enrolledSubjects.map((subject, index) => (
                        <div key={subject.id} className="col-md-6 col-lg-4">
                            <div className="card h-100 shadow-sm hover-shadow">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <span className="badge bg-primary">{subject.codigo}</span>
                                        <span className="badge bg-secondary">#{index + 1}</span>
                                    </div>

                                    <h5 className="card-title">
                                        <i className="bi bi-journal-bookmark me-2 text-primary"></i>
                                        {subject.nombre}
                                    </h5>

                                    <div className="mt-3 pt-3 border-top">
                                        <small className="text-muted">
                                            <i className="bi bi-calendar-event me-2"></i>
                                            Inscrito: {subject.fecha_matricula}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style jsx>{`
        .hover-shadow {
          transition: all 0.3s ease;
        }
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>
        </div>
    );
};

export default StudentDashboard;
