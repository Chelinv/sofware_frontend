import { useState, useEffect } from "react";
import api from "../../api/api";
import UserForm from "./UserForm";
import Swal from "sweetalert2";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get("/usuarios/");
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudieron cargar los usuarios",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedUser(null);
        setShowModal(true);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleDelete = async (user) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: `¿Deseas eliminar al usuario ${user.email}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/usuarios/${user.id}`);
                Swal.fire({
                    icon: "success",
                    title: "Eliminado",
                    text: "Usuario eliminado exitosamente",
                    timer: 2000,
                    showConfirmButton: false,
                });
                fetchUsers();
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.loading}>
                    <div style={styles.spinner}></div>
                    <p>Cargando usuarios...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>👥 Gestión de Usuarios</h2>
                <button style={styles.createButton} onClick={handleCreate}>
                    + Nuevo Usuario
                </button>
            </div>

            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.tableHeader}>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>Correo</th>
                            <th style={styles.th}>Rol</th>
                            <th style={styles.th}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={styles.emptyState}>
                                    No hay usuarios registrados
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} style={styles.tableRow}>
                                    <td style={styles.td}>{user.id}</td>
                                    <td style={styles.td}>{user.email}</td>
                                    <td style={styles.td}>
                                        <span
                                            style={{
                                                ...styles.badge,
                                                ...(user.rol === "Administrador"
                                                    ? styles.badgeAdmin
                                                    : styles.badgeUser),
                                            }}
                                        >
                                            {user.rol || "Sin rol"}
                                        </span>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={styles.actions}>
                                            <button
                                                style={styles.editButton}
                                                onClick={() => handleEdit(user)}
                                                title="Editar"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                style={styles.deleteButton}
                                                onClick={() => handleDelete(user)}
                                                title="Eliminar"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <UserForm
                    user={selectedUser}
                    onClose={handleCloseModal}
                    refresh={fetchUsers}
                />
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "20px",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
    },
    title: {
        fontSize: "28px",
        fontWeight: "600",
        color: "#1f2937",
        margin: 0,
    },
    createButton: {
        background: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "8px",
        padding: "12px 24px",
        fontSize: "16px",
        fontWeight: "500",
        cursor: "pointer",
        transition: "background 0.2s",
    },
    tableContainer: {
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        overflow: "hidden",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
    },
    tableHeader: {
        background: "#f9fafb",
        borderBottom: "2px solid #e5e7eb",
    },
    th: {
        padding: "16px",
        textAlign: "left",
        fontSize: "14px",
        fontWeight: "600",
        color: "#6b7280",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
    },
    tableRow: {
        borderBottom: "1px solid #e5e7eb",
        transition: "background 0.2s",
    },
    td: {
        padding: "16px",
        fontSize: "14px",
        color: "#374151",
    },
    badge: {
        display: "inline-block",
        padding: "4px 12px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: "600",
        textTransform: "capitalize",
    },
    badgeAdmin: {
        background: "#dbeafe",
        color: "#1e40af",
    },
    badgeUser: {
        background: "#e0e7ff",
        color: "#4338ca",
    },
    actions: {
        display: "flex",
        gap: "8px",
    },
    editButton: {
        background: "transparent",
        border: "1px solid #d1d5db",
        borderRadius: "6px",
        padding: "6px 12px",
        cursor: "pointer",
        fontSize: "16px",
        transition: "all 0.2s",
    },
    deleteButton: {
        background: "transparent",
        border: "1px solid #d1d5db",
        borderRadius: "6px",
        padding: "6px 12px",
        cursor: "pointer",
        fontSize: "16px",
        transition: "all 0.2s",
    },
    emptyState: {
        padding: "40px",
        textAlign: "center",
        color: "#9ca3af",
        fontSize: "16px",
    },
    loading: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "400px",
        gap: "16px",
    },
    spinner: {
        width: "40px",
        height: "40px",
        border: "4px solid #f3f4f6",
        borderTop: "4px solid #2563eb",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
    },
};

export default UserList;
