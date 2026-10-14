import { NavLink } from "react-router-dom";

// texto y ruta a la que lleva
const opciones = [
    { texto: "Inicio", ruta: "/" },
    { texto: "Torneos", ruta: "/torneos" },
    { texto: "Equipos", ruta: "/equipos" },
    { texto: "Jugadores", ruta: "/jugadores" },
    { texto: "Partidos", ruta: "/partidos" },
    { texto: "Ranking", ruta: "/ranking" },
    { texto: "Sanciones", ruta: "/sanciones" },
    { texto: "Tarjetas", ruta: "/tarjetas" },
    { texto: "Configuración", ruta: "/configuracion" },
];

function SideBar() {
    return (
        <aside className="sidebar">
            <h2 className="sidebar-logo">LigaApp</h2>
            <nav className="sidebar-menu">
                {opciones.map((opcion) => (
                    <NavLink key={opcion.ruta} to={opcion.ruta} end={opcion.ruta === "/"}>
                        {opcion.texto}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}

export default SideBar;