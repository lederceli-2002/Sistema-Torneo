function SideBar(){
    return(
        <aside className="sidebar">
            <h2 className="sidebar-logo">
                LigaApp
            </h2>
            <nav className="sidebar-menu">
                <button> Inicio</button>
                <button> Torneos</button>
                <button> Equipos</button>
                <button> Jugadores</button>
                <button> Partidos</button>
                <button> Ranking</button>
                <button> Sanciones</button>
                <button> Tarjetas</button>
                <button> Configuración</button>
            </nav>
        </aside>
    )
}

export default SideBar;