import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../config/api";

const PaymentForm = () => {
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  const [form, setForm] = useState({
    descripcion: "",
    monto: "",
    tipo: "CREDITO",
    cuenta_id: "",
  });

  const canSubmit = useMemo(() => {
    const montoNum = Number(form.monto);
    return (
      form.descripcion.trim().length >= 3 &&
      Number.isFinite(montoNum) &&
      montoNum > 0 &&
      form.cuenta_id
    );
  }, [form]);

  const loadAccounts = async () => {
    try {
      setLoadingAccounts(true);
      const res = await api.get("/finanzas/plan-cuentas");
      const list = Array.isArray(res.data) ? res.data : [];
      setAccounts(list);

      if (!form.cuenta_id && list.length > 0) {
        setForm((prev) => ({ ...prev, cuenta_id: list[0].id }));
      }
    } catch (error) {
      console.error("Error cargando cuentas:", error);
      Swal.fire("Error", "No se pudieron cargar las cuentas contables", "error");
      setAccounts([]);
    } finally {
      setLoadingAccounts(false);
    }
  };

  useEffect(() => {
    loadAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    if (!canSubmit) {
      Swal.fire({
        icon: "warning",
        title: "Datos incompletos",
        text: "Completa descripción, monto y cuenta antes de registrar el pago.",
      });
      return;
    }

    const payload = {
      descripcion: form.descripcion.trim(),
      monto: Number(form.monto),
      tipo: form.tipo,
      cuenta_id: form.cuenta_id,
    };

    try {
      const res = await api.post("/finanzas/transacciones", payload);

      Swal.fire({
        icon: "success",
        title: "Pago registrado",
        html: `Se registró la transacción.<br/><b>ID:</b> ${res.data?.id || "(sin id)"
          }<br/><b>Comprobante:</b> ${res.data?.comprobante_id || "(sin comprobante)"}`,
        confirmButtonText: "Ir a Pagos",
      }).then(() => navigate("/pagos"));
    } catch (error) {
      console.error("Error registrando pago:", error);
      Swal.fire("Error", "No se pudo registrar el pago.", "error");
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: 900 }}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="mb-0">
          <i className="bi bi-cash-coin me-2"></i>
          Registrar pago
        </h3>

        <button className="btn btn-outline-secondary" onClick={() => navigate("/pagos")}>
          <i className="bi bi-arrow-left me-1"></i>
          Volver
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={submit} className="row g-3">
            <div className="col-12">
              <label className="form-label">Descripción</label>
              <input
                className="form-control"
                placeholder="Ej: Pago de matrícula"
                value={form.descripcion}
                onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))}
              />
              <div className="form-text">Mínimo 3 caracteres.</div>
            </div>

            <div className="col-md-4">
              <label className="form-label">Monto</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-control"
                placeholder="0.00"
                value={form.monto}
                onChange={(e) => setForm((p) => ({ ...p, monto: e.target.value }))}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Tipo</label>
              <select
                className="form-select"
                value={form.tipo}
                onChange={(e) => setForm((p) => ({ ...p, tipo: e.target.value }))}
              >
                <option value="CREDITO">CREDITO</option>
                <option value="DEBITO">DEBITO</option>
              </select>
              <div className="form-text">
                Tip: para “pago recibido” normalmente es <b>CRÉDITO</b>.
              </div>
            </div>

            <div className="col-md-4">
              <label className="form-label">Cuenta contable</label>
              <select
                className="form-select"
                value={form.cuenta_id}
                onChange={(e) => setForm((p) => ({ ...p, cuenta_id: e.target.value }))}
                disabled={loadingAccounts}
              >
                {loadingAccounts ? (
                  <option>Cargando cuentas…</option>
                ) : accounts.length === 0 ? (
                  <option value="">No hay cuentas disponibles</option>
                ) : (
                  accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.codigo} - {a.nombre}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="col-12 d-flex gap-2 pt-2">
              <button type="submit" className="btn btn-primary" disabled={!canSubmit}>
                <i className="bi bi-check2-circle me-1"></i>
                Guardar
              </button>

              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() =>
                  setForm({
                    descripcion: "",
                    monto: "",
                    tipo: "CREDITO",
                    cuenta_id: accounts[0]?.id || "",
                  })
                }
              >
                <i className="bi bi-eraser me-1"></i>
                Limpiar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
