import { useState, useEffect } from "react";
import api from "../../api/api";
import Swal from "sweetalert2";

interface User {
  id: string;
  email: string;
  rol: string;
  nombre?: string;
}

interface UserFormProps {
  user: User | null;
  onClose: () => void;
  refresh: () => void;
}

export default function UserForm({ user, onClose, refresh }: UserFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState("Estudiante");

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setRol(user.rol);
      setNombre(user.nombre || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (user) {
        // Actualizar usuario
        const updateData: any = { email, rol, nombre };
        // Solo incluir password si se proporcionó uno nuevo
        if (password && password.trim() !== "") {
          updateData.password = password;
        }
        await api.put(`/usuarios/${user.id}`, updateData);
        Swal.fire({
          icon: "success",
          title: "¡Actualizado!",
          text: "Usuario actualizado correctamente",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        // Crear usuario
        await api.post("/usuarios/", { email, password, rol, nombre });
        Swal.fire({
          icon: "success",
          title: "¡Creado!",
          text: "Usuario creado correctamente",
          timer: 2000,
          showConfirmButton: false,
        });
      }

      refresh();
      onClose();
    } catch (error: any) {
      console.error("Error guardando usuario:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.detail || "Error al guardar el usuario",
      });
    }
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i className={`bi ${user ? 'bi-pencil-square' : 'bi-person-plus-fill'} me-2`}></i>
              {user ? "Editar Usuario" : "Nuevo Usuario"}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">
                  <i className="bi bi-person me-2"></i>
                  Nombre Completo
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej: Juan Pérez"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  <i className="bi bi-envelope me-2"></i>
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="usuario@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>


              <div className="mb-3">
                <label className="form-label">
                  <i className="bi bi-lock me-2"></i>
                  Contraseña {user && <small className="text-muted">(dejar vacío para no cambiar)</small>}
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder={user ? "Nueva contraseña (opcional)" : "Mínimo 6 caracteres"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!user}
                  minLength={6}
                />
              </div>


              <div className="mb-3">
                <label className="form-label">
                  <i className="bi bi-shield-check me-2"></i>
                  Rol
                </label>
                <select
                  className="form-select"
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                >
                  <option value="Administrador">Administrador</option>
                  <option value="Docente">Docente</option>
                  <option value="Estudiante">Estudiante</option>

                </select>
              </div>

              <div className="alert alert-info mb-0">
                <i className="bi bi-info-circle me-2"></i>
                <small>
                  {user
                    ? "Los cambios se aplicarán inmediatamente."
                    : "El usuario recibirá sus credenciales por correo."}
                </small>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                <i className="bi bi-x-circle me-2"></i>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                <i className={`bi ${user ? 'bi-check-circle' : 'bi-save'} me-2`}></i>
                {user ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
