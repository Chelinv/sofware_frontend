import { useState, useEffect } from "react";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("users")) || [];
        setUsers(stored);
    }, []);

    const saveUsers = (list) => {
        setUsers(list);
        localStorage.setItem("users", JSON.stringify(list));
    };

    const submit = () => {
        if (!form.name || !form.email || !form.password) {
            alert("Completa todos los campos");
            return;
        }

        if (editIndex !== null) {
            const updated = [...users];
            updated[editIndex] = form;
            saveUsers(updated);
            setEditIndex(null);
        } else {
            saveUsers([...users, form]);
        }

        setForm({ name: "", email: "", password: "" });
    };

    const edit = (i) => {
        setForm(users[i]);
        setEditIndex(i);
    };

    const remove = (i) => {
        if (confirm("¿Eliminar usuario?")) {
            saveUsers(users.filter((_, idx) => idx !== i));
        }
    };

    return (
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <h2 style={{ marginBottom: "20px" }}>👥 Gestión de Usuarios</h2>

            {/* FORMULARIO */}
            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "20px",
                    background: "#f9fafb",
                    padding: "16px",
                    borderRadius: "8px",
                }}
            >
                <input
                    placeholder="Nombre"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                    placeholder="Correo"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                    onClick={submit}
                    style={{
                        background: "#2563eb",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "6px 12px",
                        cursor: "pointer",
                    }}
                >
                    {editIndex !== null ? "Actualizar" : "Crear"}
                </button>
            </div>

            {/* TABLA */}
            <table width="100%" style={{ borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ background: "#f1f5f9" }}>
                        <th style={{ padding: "10px", textAlign: "left" }}>Nombre</th>
                        <th style={{ padding: "10px", textAlign: "left" }}>Correo</th>
                        <th style={{ padding: "10px" }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                            <td style={{ padding: "10px" }}>{u.name}</td>
                            <td style={{ padding: "10px" }}>{u.email}</td>
                            <td style={{ padding: "10px", textAlign: "center" }}>
                                <button onClick={() => edit(i)}>✏️</button>{" "}
                                <button onClick={() => remove(i)}>🗑️</button>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan="3" style={{ padding: "20px", textAlign: "center" }}>
                                No hay usuarios registrados
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;
