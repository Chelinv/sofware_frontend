import { useEffect, useState } from "react";
import api from "../../api/api";
import Swal from "sweetalert2";

const EnrollmentList = () => {
    const [inscripciones, setInscripciones] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [asignaturas, setAsignaturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Form state
    const [estudianteId, setEstudianteId] = useState("");
    const [asignaturaId, setAsignaturaId] = useState("");

    // Get current user
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const userRole = currentUser.rol?.toLowerCase() || "";

    // Check if user can enroll students (admin or parent)
    const canEnroll = userRole === "administrador" || userRole === "padre";

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setLoading(true);

            // Load enrollments
            const responseMatriculas = await api.get("/matriculas/");

            // If student, filter only their enrollments
            if (userRole === "estudiante") {
                const misInscripciones = responseMatriculas.data.filter(
                    (m) => m.estudiante_id === currentUser.id
                );
                setInscripciones(misInscripciones);
            } else {
                // Admin/Parent see all enrollments
                setInscripciones(responseMatriculas.data);
            }

            // If can enroll, load students and subjects
            if (canEnroll) {
                const [responseUsuarios, responseAsignaturas] = await Promise.all([
                    api.get("/usuarios/"),
                    api.get("/asignaturas/")
                ]);

                // Filter only students
                const estudiantesFiltrados = responseUsuarios.data.filter(
                    (u) => u.rol.toLowerCase() === "estudiante"
                );
                setEstudiantes(estudiantesFiltrados);
                setAsignaturas(responseAsignaturas.data);
            }
        } catch (err) {
            console.error("Error al cargar datos:", err);
            setError("Error al cargar la información");
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudieron cargar los datos",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitInscripcion = async (e) => {
        e.preventDefault();

        if (!estudianteId || !asignaturaId) {
            Swal.fire({
                icon: "warning",
                title: "Campos incompletos",
                text: "Por favor selecciona estudiante y asignatura",
            });
            return;
        }

        try {
            const fechaActual = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

            await api.post("/matriculas/", {
                estudiante_id: estudianteId,
                asignatura_id: asignaturaId,
                fecha_matricula: fechaActual
            });

            Swal.fire({
                icon: "success",
                title: "¡Inscripción exitosa!",
                text: "El estudiante ha sido inscrito correctamente",
                timer: 2000,
                showConfirmButton: false
            });

            // Reset form
            setEstudianteId("");
            setAsignaturaId("");

            // Reload enrollments
            cargarDatos();
        } catch (err) {
            console.error("Error al inscribir:", err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response?.data?.detail || "Error al crear la inscripción",
            });
        }
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h3 className="mb-4">
                <i className="bi bi-pencil-square me-2"></i>
                {userRole === "estudiante" ? "Mis Asignaturas Inscritas" : "Gestión de Inscripciones"}
            </h3>

            {error && <div className="alert alert-danger">{error}</div>}

            {/* Enrollment Form - Only for Admin and Parent */}
            {canEnroll && (
                <div className="card mb-4 shadow-sm">
                    <div className="card-header bg-primary text-white">
                        <h5 className="mb-0">
                            <i className="bi bi-plus-circle me-2"></i>
                            Inscribir Estudiante
                        </h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmitInscripcion}>
                            <div className="row">
                                <div className="col-md-5 mb-3">
                                    <label className="form-label">Estudiante</label>
                                    <select
                                        className="form-select"
                                        value={estudianteId}
                                        onChange={(e) => setEstudianteId(e.target.value)}
                                        required
                                    >
                                        <option value="">Seleccione estudiante</option>
                                        {estudiantes.map((est) => (
                                            <option key={est.id} value={est.id}>
                                                {est.nombre} ({est.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-5 mb-3">
                                    <label className="form-label">Asignatura</label>
                                    <select
                                        className="form-select"
                                        value={asignaturaId}
                                        onChange={(e) => setAsignaturaId(e.target.value)}
                                        required
                                    >
                                        <option value="">Seleccione asignatura</option>
                                        {asignaturas.map((asig) => (
                                            <option key={asig.id || asig._id} value={asig.id || asig._id}>
                                                {asig.nombre} - {asig.codigo}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-2 mb-3">
                                    <label className="form-label">&nbsp;</label>
                                    <button type="submit" className="btn btn-success w-100">
                                        <i className="bi bi-check-circle me-1"></i>
                                        Inscribir
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Enrollments List */}
            <div className="card shadow-sm">
                <div className="card-header bg-secondary text-white">
                    <h5 className="mb-0">
                        <i className="bi bi-list-ul me-2"></i>
                        {userRole === "estudiante" ? "Mis Inscripciones" : "Todas las Inscripciones"}
                    </h5>
                </div>
                <div className="card-body">
                    {inscripciones.length === 0 ? (
                        <div className="alert alert-info">
                            <i className="bi bi-info-circle me-2"></i>
                            {userRole === "estudiante"
                                ? "No tienes asignaturas inscritas en este momento."
                                : "No hay inscripciones registradas."}
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover table-bordered">
                                <thead className="table-light">
                                    <tr>
                                        <th>ID Estudiante</th>
                                        <th>ID Asignatura</th>
                                        <th>Fecha Matrícula</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inscripciones.map((inscripcion, index) => (
                                        <tr key={inscripcion.id || index}>
                                            <td>{inscripcion.estudiante_id}</td>
                                            <td>{inscripcion.asignatura_id}</td>
                                            <td>
                                                <i className="bi bi-calendar-check me-1 text-success"></i>
                                                {inscripcion.fecha_matricula}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Info Alert */}
            <div className="mt-4">
                <div className="alert alert-secondary">
                    <h6>
                        <i className="bi bi-info-circle me-2"></i>
                        Información
                    </h6>
                    <p className="mb-0">
                        {userRole === "estudiante"
                            ? "Aquí puedes ver todas las asignaturas en las que estás inscrito."
                            : "Puedes inscribir estudiantes seleccionando el estudiante y la asignatura deseada."}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EnrollmentList;
