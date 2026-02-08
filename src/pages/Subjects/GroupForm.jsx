import { useEffect, useState } from "react";
import api from "../../api/api";

const GroupForm = () => {
  const [asignaturas, setAsignaturas] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [aula, setAula] = useState("");
  const [asignaturaId, setAsignaturaId] = useState("");
  const [docenteId, setDocenteId] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    // Cargar asignaturas
    api.get("/asignaturas/").then((res) => {
      setAsignaturas(res.data);
    }).catch(err => console.error("Error cargando asignaturas:", err));

    // Cargar docentes (filtrar usuarios con rol Docente)
    api.get("/usuarios/").then((res) => {
      const docentesFiltrados = res.data.filter(u => u.rol.toLowerCase() === "docente");
      setDocentes(docentesFiltrados);
    }).catch(err => console.error("Error cargando docentes:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      await api.post("/asignaturas/grupos", {
        nombre,
        aula,
        asignatura_id: asignaturaId,
        docente_id: docenteId,
      });

      setMensaje("Grupo creado correctamente");
      setNombre("");
      setAula("");
      setAsignaturaId("");
      setDocenteId("");
    } catch (error) {
      console.error(error);
      setMensaje("Error al crear grupo");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Crear Grupo / Paralelo</h3>

      {mensaje && <div className="alert alert-info">{mensaje}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Nombre del paralelo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Aula"
            value={aula}
            onChange={(e) => setAula(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Asignatura</label>
          <select
            className="form-select"
            value={asignaturaId}
            onChange={(e) => setAsignaturaId(e.target.value)}
            required
          >
            <option value="">Seleccione asignatura</option>
            {asignaturas.map((a) => (
              <option key={a.id || a._id} value={a.id || a._id}>
                {a.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Docente</label>
          <select
            className="form-select"
            value={docenteId}
            onChange={(e) => setDocenteId(e.target.value)}
            required
          >
            <option value="">Seleccione docente</option>
            {docentes.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nombre}
              </option>
            ))}
          </select>
        </div>

        <button className="btn btn-success">Crear Grupo</button>
      </form>
    </div>
  );
};

export default GroupForm;
