import { useEffect, useState } from "react";
import api from "../../api/api";
import Swal from "sweetalert2";

const SubjectList = () => {
    const [asignaturas, setAsignaturas] = useState([]);
    const [nombre, setNombre] = useState("");
    const [codigo, setCodigo] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");

    // Cargar asignaturas
    const cargarAsignaturas = async () => {
        try {
            const response = await api.get("/asignaturas/");
            setAsignaturas(response.data);
        } catch (err) {
            setError("Error al cargar asignaturas");
            console.error(err);
        }
    };

    useEffect(() => {
        cargarAsignaturas();
    }, []);

    // Crear o actualizar asignatura
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!nombre || !codigo) {
            Swal.fire("Advertencia", "Todos los campos son obligatorios", "warning");
            return;
        }

        try {
            if (editingId) {
                // Actualizar
                await api.put(`/asignaturas/${editingId}`, {
                    nombre,
                    codigo,
                });
                Swal.fire("Éxito", "Asignatura actualizada correctamente", "success");
                setEditingId(null);
            } else {
                // Crear
                await api.post("/asignaturas/", {
                    nombre,
                    codigo,
                });
                Swal.fire("Éxito", "Asignatura creada correctamente", "success");
            }

            setNombre("");
            setCodigo("");
            cargarAsignaturas();
        } catch (err) {
            console.error(err);
            Swal.fire(
                "Error",
                err.response?.data?.detail || "Error al guardar la asignatura",
                "error"
            );
        }
    };

    // Cargar datos para editar
    const handleEdit = (asignatura) => {
        setNombre(asignatura.nombre);
        setCodigo(asignatura.codigo);
        setEditingId(asignatura.id || asignatura._id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Cancelar edición
    const handleCancelEdit = () => {
        setNombre("");
        setCodigo("");
        setEditingId(null);
    };

    // Eliminar asignatura
    const handleDelete = async (asignatura) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: `¿Deseas eliminar la asignatura "${asignatura.nombre}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/asignaturas/${asignatura.id || asignatura._id}`);
                Swal.fire("Eliminado", "Asignatura eliminada exitosamente", "success");
                cargarAsignaturas();
            } catch (err) {
                console.error(err);
                Swal.fire(
                    "Error",
                    err.response?.data?.detail || "Error al eliminar la asignatura",
                    "error"
                );
            }
        }
    };

    return (
        <div className="container mt-4">
            <h3 className="mb-4">
                <i className="bi bi-journal-bookmark me-2"></i>
                Gestión de Asignaturas
            </h3>

            {/* Formulario */}
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">
                        <i className={`bi ${editingId ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i>
                        {editingId ? "Editar Asignatura" : "Nueva Asignatura"}
                    </h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-5">
                                <label className="form-label">Nombre de la Asignatura</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ej: Matemáticas Avanzadas"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Código</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ej: MAT-101"
                                    value={codigo}
                                    onChange={(e) => setCodigo(e.target.value)}
                                />
                            </div>
                            <div className="col-md-3 d-flex align-items-end gap-2">
                                <button type="submit" className="btn btn-primary flex-grow-1">
                                    <i className={`bi ${editingId ? 'bi-check-circle' : 'bi-save'} me-2`}></i>
                                    {editingId ? "Actualizar" : "Guardar"}
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleCancelEdit}
                                    >
                                        <i className="bi bi-x-circle"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {/* Tabla */}
            <div className="card shadow-sm">
                <div className="card-header bg-light">
                    <h5 className="mb-0">
                        <i className="bi bi-list-ul me-2"></i>
                        Lista de Asignaturas ({asignaturas.length})
                    </h5>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover table-bordered mb-0">
                            <thead className="table-dark">
                                <tr>
                                    <th style={{ width: "5%" }}>#</th>
                                    <th style={{ width: "45%" }}>Nombre</th>
                                    <th style={{ width: "30%" }}>Código</th>
                                    <th style={{ width: "20%" }} className="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {asignaturas.length > 0 ? (
                                    asignaturas.map((a, index) => (
                                        <tr key={a.id || a._id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <i className="bi bi-book me-2 text-primary"></i>
                                                <strong>{a.nombre}</strong>
                                            </td>
                                            <td>
                                                <span className="badge bg-secondary">{a.codigo}</span>
                                            </td>
                                            <td className="text-center">
                                                <div className="btn-group" role="group">
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => handleEdit(a)}
                                                        title="Editar"
                                                    >
                                                        <i className="bi bi-pencil-square"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDelete(a)}
                                                        title="Eliminar"
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center text-muted py-4">
                                            <i className="bi bi-inbox display-4 d-block mb-2"></i>
                                            No hay asignaturas registradas
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubjectList;
