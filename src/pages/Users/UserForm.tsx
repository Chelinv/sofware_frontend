import { useState, useEffect } from "react";
import api from "../../config/api";

interface User {
  id: number;
  email: string;
  role: string;
}

interface UserFormProps {
  user: User | null;
  onClose: () => void;
  refresh: () => void;
}

export default function UserForm({ user, onClose, refresh }: UserFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setRole(user.role);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (user) {
        await api.put(`/users/${user.id}`, { email, role });
        alert("Usuario actualizado");
      } else {
        await api.post("/users", { email, password, role });
        alert("Usuario creado");
      }

      refresh();
      onClose();
    } catch (error) {
      alert("Error guardando usuario");
    }
  };

  return (
    <div style={styles.overlay}>
      <form style={styles.modal} onSubmit={handleSubmit}>
        <h3>{user ? "Editar Usuario" : "Nuevo Usuario"}</h3>

        <input
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {!user && (
          <input
            placeholder="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        )}

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="user">Usuario</option>
        </select>

        <div style={styles.actions}>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  modal: {
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    width: "350px",
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px"
  }
} as const;
