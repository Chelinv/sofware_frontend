import { useEffect, useState } from "react";
import api from "../../api/api";

const SubjectList = () => {
    const [asignaturas, setAsignaturas] = useState([]);
    const [nombre, setNombre] = useState("");
    const [codigo, setCodigo] = useState("");
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

    // Crear asignatura
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!nombre || !codigo) {
            setError("Todos los campos son obligatorios");
            return;
        }

        try {
            await api.post("/asignaturas/", {
                nombre,
                codigo,
            });

            setNombre("");
            setCodigo("");
            cargarAsignaturas();
        } catch (err) {
            setError("Error al crear asignatura");
            console.error(err);
        }
    };

    return (
        <div className="container mt-4">
            <h3 className="mb-4">Gestión de Asignaturas</h3>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="row">
                    <div className="col-md-5">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nombre de la asignatura"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>
                    <div className="col-md-5">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Código"
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)}
                        />
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-primary w-100">
                            Guardar
                        </button>
                    </div>
                </div>
            </form>

            {error && <div className="alert alert-danger">{error}</div>}

            {/* Tabla */}
            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>Nombre</th>
                        <th>Código</th>
                    </tr>
                </thead>
                <tbody>
                    {asignaturas.length > 0 ? (
                        asignaturas.map((a) => (
                            <tr key={a.id || a._id}>
                                <td>{a.nombre}</td>
                                <td>{a.codigo}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2" className="text-center">
                                No hay asignaturas registradas
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default SubjectList;
