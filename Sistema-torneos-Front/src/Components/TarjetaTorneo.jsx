import { useNavigate } from "react-router-dom";

// Creamos la funcion tarjetero de torneos
function TarjetaTorneo({ torneo }) {
    const navegar = useNavigate();

    const handleVerTorneo = () => {
        // Redirige directamente al Fixture del torneo seleccionado (Limpio según Mockup)
        const id = torneo.idTorneo || torneo.id;
        navegar(`/torneos/fixture/${id}`);
    };

    return (
        <div className="tarjeta-torneo">

            <div className="tarjeta-encabezado">
                <h3>{torneo.nombre}</h3>
                <span className={torneo.estado === "En curso" || torneo.estado === "ACTIVO"
                    ? "estado-torneo estado-activo" // Ternaria para cambiar de color
                    : "estado-torneo estado-inactivo" // El cuadrante de estado
                }>{torneo.estado}</span>
            </div>

            <p>Inicio: {torneo.fechaInicio}</p>
            <p>Equipos: {torneo.cantidadEquipos || 0} {"|"} Series: {torneo.series || 0}</p>
            {torneo.proximaJornada != null && (
                <p>Proxima Jornada : {torneo.proximaJornada}</p>
            )}

            {/* Redirige a la vista de Fixture por Jornadas */}
            <button onClick={handleVerTorneo} className="btn-ver-torneo">
                Ver Torneo
            </button>
        </div>
    );
}

export default TarjetaTorneo;