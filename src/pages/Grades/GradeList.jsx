import { useState, useEffect } from "react";
import api from "../../config/api";
import Swal from "sweetalert2";

const GradeList = () => {
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState("");
    const [studentMatriculas, setStudentMatriculas] = useState([]);
    const [calificaciones, setCalificaciones] = useState([]);
    const [loading, setLoading] = useState(false);

    // Cargar estudiantes, materias y calificaciones
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Cargar estudiantes
                const studentsRes = await api.get("/usuarios");
                const estudiantesFiltered = studentsRes.data.filter(
                    (u) => u.rol === "Estudiante" || u.rol === "student"
                );
                setStudents(estudiantesFiltered);

                // Cargar todas las materias
                const subjectsRes = await api.get("/asignaturas");
                setSubjects(subjectsRes.data || []);

                // DEBUG: Ver qué asignaturas se cargaron
                console.log("📚 Asignaturas cargadas:", subjectsRes.data);
                console.log("📚 IDs de asignaturas:", subjectsRes.data?.map(s => ({
                    id: s.id || s._id,
                    nombre: s.nombre
                })));

                // Cargar todas las calificaciones
                const calificacionesRes = await api.get("/calificaciones");
                setCalificaciones(calificacionesRes.data || []);
            } catch (error) {
                console.error("Error cargando datos:", error);
                Swal.fire("Error", "No se pudieron cargar los datos", "error");
            }
        };

        fetchData();
    }, []);

    // Función para obtener nombre de materia por ID
    const getSubjectName = (subjectId) => {
        if (!subjectId) return "Sin asignatura";

        // Buscar por _id o id
        const subject = subjects.find((s) => {
            const sId = s._id || s.id;
            return sId === subjectId;
        });

        if (subject) {
            return subject.nombre || subject.name || "Sin nombre";
        }

        // Si no se encuentra, mostrar mensaje más claro
        console.warn(`Asignatura no encontrada: ${subjectId}`);
        return "Asignatura no encontrada";
    };

    // Función para obtener calificación de un estudiante en una materia
    const getCalificacion = (estudianteId, asignaturaId) => {
        const calif = calificaciones.find(
            (c) => c.estudiante_id === estudianteId && c.asignatura_id === asignaturaId
        );
        return calif?.calificacion;
    };

    // Cargar matrículas del estudiante seleccionado
    useEffect(() => {
        if (!selectedStudent) {
            setStudentMatriculas([]);
            return;
        }

        const fetchStudentMatriculas = async () => {
            try {
                setLoading(true);
                // Obtener todas las matrículas
                const response = await api.get("/matriculas");
                const allMatriculas = response.data || [];

                // Filtrar matrículas del estudiante seleccionado
                const filtered = allMatriculas.filter(
                    (m) => m.estudiante_id === selectedStudent
                );

                // Enriquecer con nombres de materias y calificaciones
                const enriched = [];

                filtered.forEach((m) => {
                    // Para cada matrícula, crear una fila por cada asignatura
                    console.log("🔍 Matrícula asignatura_ids:", m.asignatura_ids);

                    m.asignatura_ids.forEach((asignaturaId) => {
                        enriched.push({
                            id: `${m.id}-${asignaturaId}`,
                            matricula_id: m.id,
                            estudiante_id: m.estudiante_id,
                            asignatura_id: asignaturaId,
                            asignatura_nombre: getSubjectName(asignaturaId),
                            fecha_matricula: m.fecha_matricula,
                            calificacion: getCalificacion(m.estudiante_id, asignaturaId),
                        });
                    });
                });

                setStudentMatriculas(enriched);
            } catch (error) {
                console.error("Error cargando matrículas:", error);
                Swal.fire(
                    "Error",
                    "No se pudieron cargar las matrículas del estudiante",
                    "error"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchStudentMatriculas();
    }, [selectedStudent, subjects, calificaciones]);

    // Obtener nombre del estudiante seleccionado
    const getStudentName = () => {
        const student = students.find((s) => (s._id || s.id) === selectedStudent);
        return student ? student.nombre || student.name : "";
    };

    // Calcular promedio
    const calculateAverage = () => {
        const calificadas = studentMatriculas.filter(
            (m) => m.calificacion !== undefined && m.calificacion !== null
        );
        if (calificadas.length === 0) return "N/A";
        const sum = calificadas.reduce((acc, m) => acc + m.calificacion, 0);
        return (sum / calificadas.length).toFixed(2);
    };

    const tableHeaderStyle = {
        padding: "12px",
        textAlign: "left",
        fontWeight: "600",
        fontSize: "14px",
        color: "#1f2937",
    };

    const tableCellStyle = {
        padding: "12px",
        fontSize: "14px",
        color: "#374151",
    };

    const summaryCardStyle = {
        padding: "15px",
        backgroundColor: "#f9fafb",
        borderRadius: "6px",
        border: "1px solid #e5e7eb",
    };

    return (
        <div className="container" style={{ padding: "20px" }}>
            <div style={{ marginBottom: "30px" }}>
                <h2 style={{ marginBottom: "20px" }}>
                    <i className="bi bi-clipboard-check me-2"></i>
                    Historial de Calificaciones
                </h2>

                {/* Selector de Estudiante */}
                <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                        Selecciona un estudiante:
                    </label>
                    <select
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                        style={{
                            width: "100%",
                            maxWidth: "400px",
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #d1d5db",
                            fontSize: "14px",
                        }}
                    >
                        <option value="">-- Selecciona un estudiante --</option>
                        {students.map((student) => (
                            <option key={student._id || student.id} value={student._id || student.id}>
                                {student.nombre || student.name} ({student.email})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Calificaciones del Estudiante */}
            {selectedStudent && (
                <>
                    {loading ? (
                        <p style={{ textAlign: "center", color: "#6b7280" }}>
                            Cargando calificaciones...
                        </p>
                    ) : studentMatriculas.length === 0 ? (
                        <div className="alert alert-info">
                            <i className="bi bi-info-circle me-2"></i>
                            El estudiante <strong>{getStudentName()}</strong> no tiene matrículas registradas.
                        </div>
                    ) : (
                        <>
                            <div
                                style={{
                                    marginBottom: "20px",
                                    padding: "15px",
                                    backgroundColor: "#e0f2fe",
                                    borderRadius: "6px",
                                    borderLeft: "4px solid #0284c7",
                                }}
                            >
                                <p style={{ margin: "0", fontSize: "14px", color: "#0c4a6e" }}>
                                    <i className="bi bi-person-fill me-2"></i>
                                    <strong>Estudiante:</strong> {getStudentName()}
                                </p>
                            </div>

                            <div style={{ overflowX: "auto" }}>
                                <table
                                    style={{
                                        width: "100%",
                                        borderCollapse: "collapse",
                                        marginBottom: "20px",
                                    }}
                                >
                                    <thead>
                                        <tr style={{ backgroundColor: "#f3f4f6", borderBottom: "2px solid #d1d5db" }}>
                                            <th style={tableHeaderStyle}>#</th>
                                            <th style={tableHeaderStyle}>Materia</th>
                                            <th style={tableHeaderStyle}>Fecha Matrícula</th>
                                            <th style={tableHeaderStyle}>Calificación</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {studentMatriculas.map((item, index) => (
                                            <tr
                                                key={item.id}
                                                style={{
                                                    borderBottom: "1px solid #e5e7eb",
                                                    backgroundColor: index % 2 === 0 ? "#fff" : "#f9fafb",
                                                }}
                                            >
                                                <td style={tableCellStyle}>{index + 1}</td>
                                                <td style={tableCellStyle}>
                                                    <i className="bi bi-journal-bookmark me-2 text-primary"></i>
                                                    <strong>{item.asignatura_nombre}</strong>
                                                </td>
                                                <td style={tableCellStyle}>
                                                    <i className="bi bi-calendar-event me-2 text-secondary"></i>
                                                    {item.fecha_matricula}
                                                </td>
                                                <td style={tableCellStyle}>
                                                    <span
                                                        style={{
                                                            padding: "6px 12px",
                                                            borderRadius: "4px",
                                                            backgroundColor:
                                                                item.calificacion !== undefined && item.calificacion !== null
                                                                    ? item.calificacion >= 70
                                                                        ? "#d1fae5"
                                                                        : item.calificacion >= 50
                                                                            ? "#fef3c7"
                                                                            : "#fee2e2"
                                                                    : "#f3f4f6",
                                                            color:
                                                                item.calificacion !== undefined && item.calificacion !== null
                                                                    ? item.calificacion >= 70
                                                                        ? "#065f46"
                                                                        : item.calificacion >= 50
                                                                            ? "#92400e"
                                                                            : "#7f1d1d"
                                                                    : "#6b7280",
                                                            fontWeight: "600",
                                                        }}
                                                    >
                                                        {item.calificacion !== undefined && item.calificacion !== null
                                                            ? item.calificacion
                                                            : "Sin calificar"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Resumen de Calificaciones */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                                    gap: "15px",
                                    marginTop: "20px",
                                }}
                            >
                                <div style={summaryCardStyle}>
                                    <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#6b7280" }}>
                                        Total de Materias
                                    </p>
                                    <p style={{ margin: "0", fontSize: "24px", fontWeight: "bold", color: "#2563eb" }}>
                                        {studentMatriculas.length}
                                    </p>
                                </div>

                                <div style={summaryCardStyle}>
                                    <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#6b7280" }}>
                                        Calificadas
                                    </p>
                                    <p style={{ margin: "0", fontSize: "24px", fontWeight: "bold", color: "#10b981" }}>
                                        {studentMatriculas.filter(
                                            (m) => m.calificacion !== undefined && m.calificacion !== null
                                        ).length}
                                    </p>
                                </div>

                                <div style={summaryCardStyle}>
                                    <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#6b7280" }}>
                                        Promedio
                                    </p>
                                    <p style={{ margin: "0", fontSize: "24px", fontWeight: "bold", color: "#f59e0b" }}>
                                        {calculateAverage()}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default GradeList;
