import { useState, useEffect } from "react";
import api from "../../config/api";
import Swal from "sweetalert2";

const EnrollmentForm = () => {
  // Get current user to check role
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const userRole = currentUser.rol?.toLowerCase() || "";

  // Check if user can create enrollments (admin or padre)
  const canCreateEnrollment = userRole === "administrador" || userRole === "padre";

  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // If user doesn't have permission, show access denied
  if (!canCreateEnrollment) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <h4 className="alert-heading">
            <i className="bi bi-exclamation-triangle me-2"></i>
            Acceso Denegado
          </h4>
          <p className="mb-0">
            Solo <strong>Administradores</strong> y <strong>Padres</strong> pueden crear inscripciones.
          </p>
        </div>
      </div>
    );
  }

  // Cargar estudiantes
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoadingStudents(true);
        const response = await api.get("/usuarios");
        const estudiantes = response.data.filter(
          (u) => u.rol === "Estudiante");
        setStudents(estudiantes);
      } catch (error) {
        console.error("Error al cargar estudiantes:", error);
        Swal.fire("Error", "No se pudieron cargar los estudiantes", "error");
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudents();
  }, []);

  // Cargar asignaturas
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoadingSubjects(true);
        const response = await api.get("/asignaturas");
        setSubjects(response.data);
      } catch (error) {
        console.error("Error al cargar asignaturas:", error);
        Swal.fire("Error", "No se pudieron cargar las asignaturas", "error");
      } finally {
        setLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleSubjectToggle = (subjectId) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedStudent || selectedSubjects.length === 0) {
      Swal.fire("Advertencia", "Por favor selecciona un estudiante y al menos una materia", "warning");
      return;
    }

    setSubmitting(true);
    try {
      const enrollmentData = {
        estudiante_id: selectedStudent,
        asignatura_ids: selectedSubjects,
        fecha_matricula: new Date().toISOString().split("T")[0],
      };

      const response = await api.post("/matriculas", enrollmentData);

      Swal.fire("Éxito", "Materias asignadas correctamente al estudiante", "success");
      setSelectedStudent("");
      setSelectedSubjects([]);
    } catch (error) {
      console.error("Error al asignar materias:", error);
      Swal.fire(
        "Error",
        error.response?.data?.detail || "Error al asignar las materias",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ marginBottom: "30px", textAlign: "center" }}>
        <i className="bi bi-person-plus-fill me-2"></i>
        Asignar Materias a Estudiante
      </h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Seleccionar Estudiante */}
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
            Estudiante:
          </label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            disabled={loadingStudents}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
            }}
          >
            <option value="">
              {loadingStudents ? "Cargando estudiantes..." : "Selecciona un estudiante"}
            </option>
            {students.map((student) => (
              <option key={student._id || student.id} value={student._id || student.id}>
                {student.nombre || student.name} ({student.email})
              </option>
            ))}
          </select>
        </div>

        {/* Seleccionar Materias con Checkboxes */}
        <div>
          <label style={{ display: "block", marginBottom: "12px", fontWeight: "500" }}>
            Materias (selecciona una o más):
          </label>
          {loadingSubjects ? (
            <p style={{ color: "#6b7280", fontSize: "14px" }}>Cargando materias...</p>
          ) : subjects.length === 0 ? (
            <p style={{ color: "#ef4444", fontSize: "14px" }}>No hay materias disponibles</p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                padding: "12px",
                backgroundColor: "#f9fafb",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
              }}
            >
              {subjects.map((subject) => (
                <label
                  key={subject._id || subject.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: "4px",
                    backgroundColor: selectedSubjects.includes(subject._id || subject.id)
                      ? "#dbeafe"
                      : "transparent",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedSubjects.includes(subject._id || subject.id)}
                    onChange={() => handleSubjectToggle(subject._id || subject.id)}
                    style={{ cursor: "pointer", width: "18px", height: "18px" }}
                  />
                  <span style={{ fontSize: "14px", fontWeight: "500" }}>
                    {subject.nombre || subject.name}
                  </span>
                </label>
              ))}
            </div>
          )}
          {selectedSubjects.length > 0 && (
            <p style={{ marginTop: "8px", fontSize: "12px", color: "#2563eb" }}>
              {selectedSubjects.length} materia(s) seleccionada(s)
            </p>
          )}
        </div>

        {/* Botón Submit */}
        <button
          type="submit"
          disabled={submitting}
          style={{
            backgroundColor: submitting ? "#9ca3af" : "#2563eb",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: submitting ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: "500",
          }}
        >
          {submitting ? "Asignando..." : "Asignar Materias"}
        </button>
      </form>

      {/* Info adicional */}
      <div
        style={{
          marginTop: "30px",
          padding: "15px",
          backgroundColor: "#f0f4f8",
          borderRadius: "6px",
          borderLeft: "4px solid #2563eb",
        }}
      >
        <p style={{ margin: "0", fontSize: "14px", color: "#1f2937" }}>
          <strong>Nota:</strong> Ahora puedes asignar múltiples materias a un estudiante en una sola matrícula.
          Selecciona todas las materias que desees con los checkboxes.
        </p>
      </div>
    </div>
  );
};

export default EnrollmentForm;
