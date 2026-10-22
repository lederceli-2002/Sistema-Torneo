import { NavLink } from "react-router-dom";

// Opciones del menú con estado de habilitación correcto
const opciones = [
  { texto: "Inicio", ruta: "/", deshabilitado: false },
  { texto: "Jugadores", ruta: "/jugadores", deshabilitado: false },
  { texto: "Equipos", ruta: "/equipos", deshabilitado: false },
  { texto: "Torneos", ruta: "/torneos", deshabilitado: true },
  { texto: "Partidos", ruta: "/partidos", deshabilitado: true },
  { texto: "Ranking", ruta: "/ranking", deshabilitado: true },
  { texto: "Sanciones", ruta: "/sanciones", deshabilitado: true },
  { texto: "Tarjetas", ruta: "/tarjetas", deshabilitado: true },
  { texto: "Configuración", ruta: "/configuracion", deshabilitado: true },
];

function SideBar() {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-logo">SystemFutbol</h2>
      <nav className="sidebar-menu">
        {opciones.map((opcion) => (
          opcion.deshabilitado ? (
            <span
              key={opcion.ruta}
              className="sidebar-item-disabled"
              onClick={(e) => e.preventDefault()}
              style={{
                display: "block",
                padding: "10px 15px",
                opacity: 0.45,
                cursor: "not-allowed",
                userSelect: "none"
              }}
            >
              {opcion.texto}
            </span>
          ) : (
            <NavLink key={opcion.ruta} to={opcion.ruta} end={opcion.ruta === "/"}>
              {opcion.texto}
            </NavLink>
          )
        ))}
      </nav>
    </aside>
  );
}

export default SideBar;