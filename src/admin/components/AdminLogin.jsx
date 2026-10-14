
import { useState } from "react";
import { supabase } from "../../lib/supabase.js";

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    onLogin(data.user);
  }

  const inputStyle = {
    display: "block",
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 16px",
    marginTop: "8px",
    border: "1px solid #e7d3dc",
    borderRadius: "12px",
    background: "#fffdfd",
    color: "#342b2b",
    fontSize: "15px",
    outlineColor: "#bd8da1",
    fontFamily: "inherit",
  };

  const labelStyle = {
    display: "block",
    color: "#542d3b",
    fontWeight: "600",
    fontSize: "14px",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "28px 18px",
        background:
          "linear-gradient(135deg, #f8edf1 0%, #f3e2e9 50%, #fbf6f3 100%)",
        fontFamily: "Arial, sans-serif",
        color: "#342b2b",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "420px",
          boxSizing: "border-box",
          padding: "38px 32px",
          background: "#fffdfb",
          border: "1px solid #ead8df",
          borderRadius: "26px",
          boxShadow: "0 18px 45px rgba(84, 45, 59, 0.12)",
        }}
      >
        <header style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "58px",
              height: "58px",
              margin: "0 auto 18px",
              borderRadius: "50%",
              background: "#f3dce5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#542d3b",
              fontSize: "27px",
            }}
          >
            ♡
          </div>

          <h1
            style={{
              margin: "0 0 10px",
              color: "#542d3b",
              fontSize: "27px",
              lineHeight: 1.3,
              fontFamily: "Georgia, serif",
              fontWeight: "600",
            }}
          >
            Piki's Boutique
          </h1>

          <p
            style={{
              margin: 0,
              color: "#927582",
              fontSize: "14px",
              lineHeight: 1.6,
            }}
          >
            Bienvenida al panel administrativo
          </p>
        </header>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "22px" }}>
            <label htmlFor="admin-email" style={labelStyle}>
              Correo electrónico
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
              placeholder="tu@correo.com"
            />
          </div>

          
<div style={{ marginBottom: "18px" }}>
  <label htmlFor="admin-password" style={labelStyle}>
    Contraseña
  </label>

  <div style={{ position: "relative" }}>
    <input
      id="admin-password"
      type={showPassword ? "text" : "password"}
      autoComplete="current-password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      style={{
        ...inputStyle,
        width: "100%",
        boxSizing: "border-box",
        paddingRight: "52px",
      }}
      placeholder="Ingresa tu contraseña"
    />

    <button
      type="button"
      onClick={() => setShowPassword((previous) => !previous)}
      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
      title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
      style={{
        position: "absolute",
        right: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        border: "none",
        background: "transparent",
        color: "#542d3b",
        cursor: "pointer",
        fontSize: "13px",
        padding: "6px",
        fontWeight: 600,
      }}
    >
      {showPassword ? "Ocultar" : "Ver"}
    </button>
  </div>
</div>

          {error && (
            <p
              role="alert"
              style={{
                color: "#a52f4b",
                background: "#fbecef",
                border: "1px solid #f0d0d9",
                borderRadius: "12px",
                padding: "12px 14px",
                fontSize: "14px",
                lineHeight: 1.5,
                margin: "0 0 18px",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              display: "block",
              width: "100%",
              marginTop: "26px",
              padding: "14px 20px",
              border: "none",
              borderRadius: "999px",
              background: loading ? "#a98593" : "#542d3b",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: "600",
              fontFamily: "inherit",
              cursor: loading ? "wait" : "pointer",
              boxShadow: "0 7px 16px rgba(84, 45, 59, 0.18)",
              transition: "background 0.2s ease",
            }}
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <p
          style={{
            margin: "26px 0 0",
            textAlign: "center",
            color: "#a18490",
            fontSize: "12px",
          }}
        >
          Piki's Boutique · Con cariño ♡
        </p>
      </section>
    </main>
  );
}

export default AdminLogin;
