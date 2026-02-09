import { useState, useEffect } from "react";
import api from "../../config/api";
import Swal from "sweetalert2";

const GradeBook = () => {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [matriculas, setMatriculas] = useState([]);
  const [calificaciones, setCalificaciones] = useState([]);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Cargar materias y estudiantes
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const subjectsRes = await api.get("/asignaturas");
        setSubjects(subjectsRes.data || []);

        const studentsRes = await api.get("/usuarios");
        setStudents(studentsRes.data || []);
      } catch (error) {
        console.error("Error cargando datos iniciales:", error);
        Swal.fire("Error", "No se pudieron cargar los datos iniciales", "error");
      }
    };

    fetchInitialData();
  }, []);

  // Función para obtener nombre del estudiante por ID
  const getStudentName = (studentId) => {
    const student = students.find((s) => (s._id || s.id) === studentId);
    return student?.nombre || student?.name || studentId;
  };

  // Función para obtener email del estudiante por ID
  const getStudentEmail = (studentId) => {
    const student = students.find((s) => (s._id || s.id) === studentId);
    return student?.email || "N/A";
  };

  // Cargar matrículas y calificaciones cuando cambia la materia seleccionada
  useEffect(() => {
    if (!selectedSubject || students.length === 0) {
      setMatriculas([]);
      setCalificaciones([]);
      setGrades({});
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const matriculasRes = await api.get("/matriculas");
        const allMatriculas = matriculasRes.data || [];

        const filtered = allMatriculas.filter((m) =>
          m.asignatura_ids.includes(selectedSubject)
        );

        setMatriculas(filtered);

        const calificacionesRes = await api.get("/calificaciones");
        const allCalificaciones = calificacionesRes.data || [];
        setCalificaciones(allCalificaciones);

        const initialGrades = {};
        filtered.forEach((m) => {
          const existingCalif = allCalificaciones.find(
            (c) => c.estudiante_id === m.estudiante_id && c.asignatura_id === selectedSubject
          );

          if (existingCalif) {
            initialGrades[m.id] = {
              calificacion_id: existingCalif.id,
              nota: existingCalif.calificacion || "",
            };
          } else {
            initialGrades[m.id] = {
              calificacion_id: null,
              nota: "",
            };
          }
        });
        setGrades(initialGrades);
      } catch (error) {
        console.error("Error cargando datos:", error);
        Swal.fire("Error", "No se pudieron cargar los datos", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedSubject, students]);

  const handleGradeChange = (matriculaId, value) => {
    setGrades((prev) => ({
      ...prev,
      [matriculaId]: {
        ...prev[matriculaId],
        nota: value,
      },
    }));
  };

  const handleSaveGrades = async () => {
    if (matriculas.length === 0) {
      Swal.fire("Advertencia", "No hay estudiantes para calificar", "warning");
      return;
    }

    const invalid = Object.entries(grades).find(
      ([, data]) => data.nota !== "" && (isNaN(data.nota) || data.nota < 0 || data.nota > 100)
    );

    if (invalid) {
      Swal.fire("Error", "Las notas deben estar entre 0 y 100", "error");
      return;
    }

    setSubmitting(true);
    try {
      const fechaActual = new Date().toISOString().split("T")[0];

      for (const matricula of matriculas) {
        const gradeData = grades[matricula.id];

        if (gradeData.nota !== "") {
          const calificacionPayload = {
            estudiante_id: matricula.estudiante_id,
            asignatura_id: selectedSubject,
            calificacion: parseFloat(gradeData.nota),
            fecha_evaluacion: fechaActual,
          };

          if (gradeData.calificacion_id) {
            await api.put(`/calificaciones/${gradeData.calificacion_id}`, calificacionPayload);
          } else {
            await api.post("/calificaciones/", calificacionPayload);
          }
        }
      }

      Swal.fire("Éxito", "Calificaciones guardadas correctamente", "success");

      const calificacionesRes = await api.get("/calificaciones");
      setCalificaciones(calificacionesRes.data || []);
    } catch (error) {
      console.error("Error guardando calificaciones:", error);
      Swal.fire(
        "Error",
        error.response?.data?.detail || "Error al guardar las calificaciones",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: "20px" }}>
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ marginBottom: "20px" }}>
          <i className="bi bi-pencil-square me-2"></i>
          Libro de Calificaciones
        </h2>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
            Selecciona una materia:
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            style={{
              width: "100%",
              maxWidth: "400px",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
            }}
          >
            <option value="">-- Selecciona una materia --</option>
            {subjects.map((subject) => (
              <option key={subject._id || subject.id} value={subject._id || subject.id}>
                {subject.nombre || subject.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedSubject && (
        <>
          {loading ? (
            <p style={{ textAlign: "center", color: "#6b7280" }}>Cargando estudiantes...</p>
          ) : matriculas.length === 0 ? (
            <div className="alert alert-info">
              <i className="bi bi-info-circle me-2"></i>
              No hay estudiantes matriculados en esta materia.
            </div>
          ) : (
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
                    <th style={tableHeaderStyle}>Estudiante</th>
                    <th style={tableHeaderStyle}>Email</th>
                    <th style={tableHeaderStyle}>Calificación (0-100)</th>
                    <th style={tableHeaderStyle}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {matriculas.map((matricula, index) => (
                    <tr
                      key={matricula.id}
                      style={{
                        borderBottom: "1px solid #e5e7eb",
                        backgroundColor: index % 2 === 0 ? "#fff" : "#f9fafb",
                      }}
                    >
                      <td style={tableCellStyle}>
                        <i className="bi bi-person-fill me-2 text-primary"></i>
                        <strong>{getStudentName(matricula.estudiante_id)}</strong>
                      </td>
                      <td style={tableCellStyle}>
                        <i className="bi bi-envelope me-2 text-secondary"></i>
                        {getStudentEmail(matricula.estudiante_id)}
                      </td>
                      <td style={tableCellStyle}>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={grades[matricula.id]?.nota || ""}
                          onChange={(e) =>
                            handleGradeChange(matricula.id, e.target.value)
                          }
                          placeholder="Ej: 95.5"
                          style={{
                            width: "100%",
                            padding: "8px",
                            borderRadius: "4px",
                            border: "1px solid #d1d5db",
                            fontSize: "14px",
                          }}
                        />
                      </td>
                      <td style={tableCellStyle}>
                        {grades[matricula.id]?.calificacion_id ? (
                          <span className="badge bg-success">Calificado</span>
                        ) : (
                          <span className="badge bg-secondary">Pendiente</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ textAlign: "right", marginTop: "20px" }}>
                <button
                  onClick={handleSaveGrades}
                  disabled={submitting || matriculas.length === 0}
                  style={{
                    backgroundColor: submitting ? "#9ca3af" : "#10b981",
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "6px",
                    cursor: submitting ? "not-allowed" : "pointer",
                    fontSize: "16px",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginLeft: "auto",
                  }}
                >
                  <i className="bi bi-check-circle"></i>
                  {submitting ? "Guardando..." : "Guardar Calificaciones"}
                </button>
              </div>

              <div className="alert alert-info mt-4">
                <i className="bi bi-info-circle me-2"></i>
                <strong>Nota:</strong> Las calificaciones se guardan en la tabla de calificaciones.
                Si ya existe una calificación para un estudiante en esta materia, se actualizará.
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
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

export default GradeBook;
