import { Outlet, useNavigate, useLocation } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleLogout = () => {
    localStorage.removeItem("token"); // o sessionStorage si usas ese
    navigate("/login");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div>
      {/* HEADER SUPERIOR */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
        }}
      >
        <div></div>

        {/* BOTONES - Solo mostrar si NO estamos en la página de inicio */}
        {!isHomePage && (
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleBack}
              style={{
                padding: "6px 14px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                background: "white",
                cursor: "pointer",
              }}
            >
              ⬅ Regresar
            </button>

            <button
              onClick={handleLogout}
              style={{
                padding: "6px 14px",
                borderRadius: "6px",
                border: "none",
                background: "#dc2626",
                color: "white",
                cursor: "pointer",
              }}
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </header>

      {/* CONTENIDO */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
