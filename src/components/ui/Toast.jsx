const Toast = ({ message }) => {
  if (!message) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        background: "#1e3a8a",
        color: "white",
        padding: "12px 18px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        zIndex: 999,
      }}
    >
      {message}
    </div>
  );
};

export default Toast;
