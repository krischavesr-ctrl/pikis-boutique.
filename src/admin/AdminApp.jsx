import { useEffect, useState } from "react";
import ProductsAdmin from "./components/ProductsAdmin";
import AdminLogin from "./components/AdminLogin";
import { supabase } from "../lib/supabase.js";
import "./admin.css";

const PROFILE_KEY = "pikis-admin-profile";

const defaultProfile = {
  name: "Administrador",
  email: "",
  role: "Administrador",
};

function readProfile() {
  try {
    const saved = localStorage.getItem(PROFILE_KEY);
    return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile;
  } catch {
    return defaultProfile;
  }
}

export default function AdminApp() {
    
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCheckingSession(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setSession(null);
  }

    
  const [section, setSection] = useState("Dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState(readProfile);
  const [draft, setDraft] = useState(readProfile);
  const [message, setMessage] = useState("");

  const menu = ["Dashboard", "Productos", "Pedidos", "Clientes", "Mi perfil"];

  function handleProfileChange(event) {
    const { name, value } = event.target;
    setDraft((current) => ({ ...current, [name]: value }));
    setMessage("");
  }

  function saveProfile(event) {
    event.preventDefault();

    const updatedProfile = {
      ...profile,
      name: draft.name.trim(),
      email: draft.email.trim(),
    };

    if (!updatedProfile.name || !updatedProfile.email) {
      setMessage("Completa tu nombre y tu correo electrónico.");
      return;
    }

    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
      setDraft(updatedProfile);
      setMessage("Perfil guardado correctamente.");
    } catch {
      setMessage("No se pudo guardar el perfil en este navegador.");
    }
  }

  function cancelProfileEdit() {
    setDraft(profile);
    setMessage("");
  }

  const pageStyle = {
    flex: 1,
    minWidth: 0,
    padding: "32px",
    boxSizing: "border-box",
  };

  const cardStyle = {
    background: "#fff",
    border: "1px solid #eadde1",
    borderRadius: "14px",
    padding: "24px",
  };

  const fieldStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    marginTop: "7px",
    border: "1px solid #d9cbd0",
    borderRadius: "8px",
    fontSize: "15px",
  };

  const primaryButtonStyle = {
    padding: "12px 18px",
    border: "none",
    borderRadius: "8px",
    background: "#713e54",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  };

  if (checkingSession) {
    return <p>Comprobando sesión...</p>;
  }

  
if (!session) {
  return (
    <AdminLogin
      onLogin={async () => {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
      }}
    />
  );
}


  return (
    <div
      className="admin-layout"
      style={{
        display: "flex",
        flexWrap: "wrap",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        background: "#f7f4f2",
        color: "#342b2b",
      }}
    >
     
<aside className="admin-sidebar">
  <div className="admin-mobile-header">
    <h2>Piki's Boutique</h2>

    <button
      type="button"
      onClick={() => setMobileMenuOpen((open) => !open)}
      aria-expanded={mobileMenuOpen}
      aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
    >
      {mobileMenuOpen ? "Cerrar ×" : "Menú ☰"}
    </button>
  </div>

  <div
   className={`admin-sidebar-content ${
    mobileMenuOpen ? "is-open" : ""
  }`}

>
    <p className="admin-sidebar-subtitle">
      Panel administrativo
    </p>

    <nav>
      {menu.map((item) => (
        <button
          key={item}
          onClick={() => {
            setSection(item);
            setMessage("");
            setMobileMenuOpen(false);
          }}
          style={{
            padding: "13px",
            textAlign: "left",
            border: "none",
            borderRadius: "999px",
            cursor: "pointer",
            background: section === item ? "#d9a5b5" : "transparent",
            color: section === item ? "#38272d" : "white",
            fontWeight: "bold",
          }}
        >
          {item}
        </button>
      ))}
    </nav>

    <div className="admin-session">
      <p style={{ marginBottom: "5px" }}>
        Sesión administrativa
      </p>

      <small style={{ color: "#e8cbd5" }}>
        {profile.name}
      </small>

      <button
        onClick={handleLogout}
        style={{
          display: "block",
          width: "100%",
          padding: "12px 20px",
          marginTop: "24px",
          border: "1px solid #e8bdcd",
          borderRadius: "999px",
          background: "#f3d6e1",
          color: "#542d3b",
          fontSize: "14px",
          fontWeight: "600",
          fontFamily: "inherit",
          cursor: "pointer",
        }}
      >
        Cerrar sesión
      </button>
    </div>
  </div>
</aside>

<main className="admin-content" style={pageStyle}>
        {section === "Dashboard" && (
  <>
    <h1 className="dashboard-title">Panel administrativo</h1>
    <p className="dashboard-subtitle">
      Aquí tienes el resumen de tu tienda.
    </p>
           <div
           className="dashboard-grid"
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
    gap: "16px",
    marginTop: "24px",
    width: "100%",
    boxSizing: "border-box",
  }}
>
              {[
                ["Productos", "Gestiona el catálogo"],
                ["Pedidos", "Consulta los pedidos"],
                ["Clientes", "Revisa los clientes"],
                ["Mi perfil", "Administra tus datos"],
              ].map(([title, description]) => (
                <button
                className="dashboard-card"
                  key={title}
                  onClick={() => setSection(title)}
                 style={{
  ...cardStyle,
  boxSizing: "border-box",
  width: "100%",
  minWidth: 0,
  padding: "22px",
  textAlign: "left",
  cursor: "pointer",
  color: "#342b2b",
  borderRadius: "20px",
  boxShadow: "0 5px 16px rgba(84, 45, 59, 0.05)",
}}
                >
                  <h2>{title}</h2>
                  <p>{description}</p>
                  <span>Ver sección →</span>
                </button>
              ))}
            </div>
          </>
        )}

        {section === "Productos" && <ProductsAdmin />}

        {section === "Pedidos" && (
          <>
            <h1>Pedidos</h1>
            <div style={cardStyle}>
              <p>
                Aquí podrás consultar y gestionar los pedidos de la tienda.
              </p>
              <p>
                Esta sección todavía debe conectarse a los datos reales de los
                pedidos.
              </p>
            </div>
          </>
        )}

        {section === "Clientes" && (
          <>
            <h1>Clientes</h1>
            <div style={cardStyle}>
              <p>Aquí podrás consultar la información de los clientes.</p>
              <p>
                Esta sección todavía debe conectarse a los datos reales de los
                clientes.
              </p>
            </div>
          </>
        )}

        {section === "Mi perfil" && (
          <>
            <h1>Mi perfil</h1>
            <p>Consulta y actualiza tu información administrativa.</p>

            <section
              style={{
                ...cardStyle,
                maxWidth: "650px",
                marginTop: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  marginBottom: "28px",
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "#f1dde5",
                    color: "#713e54",
                    display: "grid",
                    placeItems: "center",
                    fontSize: "26px",
                    fontWeight: "bold",
                  }}
                >
                  {(profile.name.trim()[0] || "A").toUpperCase()}
                </div>
                <div>
                  <h2 style={{ margin: "0 0 6px" }}>{profile.name}</h2>
                  <p style={{ margin: 0, color: "#78666d" }}>
                    {profile.role}
                  </p>
                </div>
              </div>

              <form onSubmit={saveProfile}>
                <label
                  htmlFor="admin-name"
                  style={{ display: "block", fontWeight: "bold" }}
                >
                  Nombre completo
                </label>
                <input
                  id="admin-name"
                  name="name"
                  value={draft.name}
                  onChange={handleProfileChange}
                  autoComplete="name"
                  required
                  style={fieldStyle}
                />

                <label
                  htmlFor="admin-email"
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    marginTop: "20px",
                  }}
                >
                  Correo electrónico
                </label>
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  value={draft.email}
                  onChange={handleProfileChange}
                  autoComplete="email"
                  required
                  style={fieldStyle}
                />

                <label
                  htmlFor="admin-role"
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    marginTop: "20px",
                  }}
                >
                  Rol
                </label>
                <input
                  id="admin-role"
                  value={profile.role}
                  readOnly
                  style={{ ...fieldStyle, background: "#f3eff0" }}
                />

                {message && (
                  <p role="status" style={{ marginTop: "18px" }}>
                    {message}
                  </p>
                )}

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "12px",
                    marginTop: "24px",
                  }}
                >
                  <button type="submit" style={primaryButtonStyle}>
                    Guardar cambios
                  </button>
                  <button
                    type="button"
                    onClick={cancelProfileEdit}
                    style={{
                      padding: "12px 18px",
                      border: "1px solid #d9cbd0",
                      borderRadius: "8px",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </section>

            <p style={{ maxWidth: "650px", color: "#78666d", fontSize: "13px" }}>
              Por ahora, los datos se guardan únicamente en este navegador.
              Este perfil todavía no está conectado a un sistema de cuentas.
            </p>
          </>
        )}
      </main>
    </div>
  );
}