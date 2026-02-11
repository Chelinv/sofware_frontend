import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../config/api";

const PaymentList = () => {
    const [transactions, setTransactions] = useState([]);
    const [vouchers, setVouchers] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingStudents, setLoadingStudents] = useState(true);

    // Reportes
    const [selectedStudent, setSelectedStudent] = useState("");

    const loadData = async () => {
        try {
            setLoading(true);

            const [tRes, vRes] = await Promise.allSettled([
                api.get("/finanzas/transacciones"),
                api.get("/finanzas/comprobantes"),
            ]);

            if (tRes.status === "fulfilled") {
                setTransactions(Array.isArray(tRes.value.data) ? tRes.value.data : []);
            } else {
                setTransactions([]);
                Swal.fire("Error", "No se pudieron cargar las transacciones.", "error");
            }

            if (vRes.status === "fulfilled") {
                setVouchers(Array.isArray(vRes.value.data) ? vRes.value.data : []);
            } else {
                setVouchers([]);
            }
        } catch (error) {
            console.error("Error cargando pagos:", error);
            Swal.fire("Error", "Ocurrió un error cargando pagos.", "error");
            setTransactions([]);
            setVouchers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            setLoadingStudents(true);
            const response = await api.get("/usuarios");
            const estudiantesData = response.data.filter(u => u.rol === "Estudiante");
            setStudents(estudiantesData);
        } catch (error) {
            console.error("Error cargando estudiantes:", error);
            setStudents([]);
        } finally {
            setLoadingStudents(false);
        }
    };

    const voucherById = useMemo(() => {
        const map = new Map();
        vouchers.forEach((v) => map.set(v.id, v));
        return map;
    }, [vouchers]);

    const openVoucher = (voucherId) => {
        const v = voucherById.get(voucherId);
        if (!v) {
            Swal.fire("Info", "Comprobante no disponible.", "info");
            return;
        }

        Swal.fire({
            icon: "info",
            title: "Detalle del comprobante",
            html: `
        <div style="text-align:left">
          <div><b>ID:</b> ${v.id}</div>
          <div><b>Fecha de emisión:</b> ${v.fecha_emision ? new Date(v.fecha_emision).toLocaleString() : "-"
                }</div>
          <div><b>Concepto:</b> ${v.concepto || "-"}</div>
          <div><b>Transacción:</b> <code>${v.transaccion_id || "-"}</code></div>
        </div>
      `,
            width: 720,
            confirmButtonText: "Cerrar",
        });
    };

    const downloadBlob = (blob, filename) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    };

    const downloadReportPdf = async (endpoint, filename) => {
        if (!selectedStudent) {
            Swal.fire({
                icon: "warning",
                title: "Selecciona un estudiante",
                text: "Debes seleccionar un estudiante para descargar el reporte.",
            });
            return;
        }

        try {
            const url = endpoint.replace(":id", selectedStudent);

            const res = await api.get(url, {
                responseType: "blob",
                headers: { Accept: "application/pdf" },
            });

            downloadBlob(res.data, filename);
            Swal.fire({
                icon: "success",
                title: "Descarga iniciada",
                text: filename,
                timer: 1200,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error("Error descargando reporte:", error);
            Swal.fire("Error", "No se pudo descargar el reporte.", "error");
        }
    };

    return (
        <div className="container py-4">
            <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-3">
                <h3 className="mb-0">
                    <i className="bi bi-credit-card me-2"></i>
                    Pagos & Finanzas
                </h3>

                <div className="d-flex gap-2">
                    <button className="btn btn-outline-secondary" onClick={loadData}>
                        <i className="bi bi-arrow-clockwise me-1"></i>
                        Actualizar
                    </button>

                    <Link className="btn btn-primary" to="/pagos/registrar">
                        <i className="bi bi-plus-circle me-1"></i>
                        Registrar pago
                    </Link>
                </div>
            </div>

            {/* Reportes */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        <h5 className="mb-0">
                            <i className="bi bi-filetype-pdf me-2"></i>
                            Descarga de reportes (PDF)
                        </h5>
                    </div>

                    <div className="row g-2 align-items-end">
                        <div className="col-md-4">
                            <label className="form-label">Seleccionar Estudiante</label>
                            <select
                                className="form-select"
                                value={selectedStudent}
                                onChange={(e) => setSelectedStudent(e.target.value)}
                                disabled={loadingStudents}
                            >
                                <option value="">
                                    {loadingStudents ? "Cargando estudiantes..." : "Selecciona un estudiante"}
                                </option>
                                {students.map((student) => (
                                    <option key={student._id || student.id} value={student._id || student.id}>
                                        {student.nombre} ({student.email})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-8 d-flex flex-wrap gap-2">
                            <button
                                className="btn btn-outline-primary"
                                onClick={() =>
                                    downloadReportPdf(
                                        "/reportes/certificados/:id",
                                        `certificado_${students.find(s => (s._id || s.id) === selectedStudent)?.nombre || "estudiante"}.pdf`
                                    )
                                }
                            >
                                <i className="bi bi-award me-1"></i>
                                Certificado
                            </button>

                            <button
                                className="btn btn-outline-primary"
                                onClick={() =>
                                    downloadReportPdf(
                                        "/reportes/record-academico/:id",
                                        `record_${students.find(s => (s._id || s.id) === selectedStudent)?.nombre || "estudiante"}.pdf`
                                    )
                                }
                            >
                                <i className="bi bi-journal-text me-1"></i>
                                Récord académico
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabla transacciones */}
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        <h5 className="mb-0">
                            <i className="bi bi-receipt me-2"></i>
                            Transacciones
                        </h5>
                    </div>

                    {loading ? (
                        <div className="alert alert-info mb-0">Cargando…</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Descripción</th>
                                        <th className="text-end">Monto</th>
                                        <th>Tipo</th>
                                        <th>Comprobante</th>
                                        <th className="text-end">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((t) => (
                                        <tr key={t.id}>
                                            <td>{t.fecha ? new Date(t.fecha).toLocaleString() : "-"}</td>
                                            <td>{t.descripcion}</td>
                                            <td className="text-end">{Number(t.monto).toFixed(2)}</td>
                                            <td>
                                                <span
                                                    className={`badge ${t.tipo === "CREDITO" ? "bg-success" : "bg-warning text-dark"
                                                        }`}
                                                >
                                                    {t.tipo}
                                                </span>
                                            </td>
                                            <td>
                                                <code>{t.comprobante_id}</code>
                                            </td>
                                            <td className="text-end">
                                                <button
                                                    className="btn btn-sm btn-outline-secondary"
                                                    onClick={() => openVoucher(t.comprobante_id)}
                                                >
                                                    <i className="bi bi-search me-1"></i>
                                                    Ver
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                    {transactions.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="text-center py-4">
                                                No hay transacciones registradas.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentList;
