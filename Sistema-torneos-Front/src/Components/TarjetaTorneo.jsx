import { useNavigate } from "react-router-dom";

//Creamos la funcion tarjetero de torneos
function TarjetaTorneo({torneo}){
    const navegar = useNavigate();

    return(
        <div className="tarjeta-torneo">

            <div className="tarjeta-encabezado">
                <h3>{torneo.nombre}</h3>
                <span className={torneo.estado==="En curso"
                    ? "estado-torneo estado-activo" //Ternaria para cambiar de color
                    : "estado-torneo estado-inactivo" //el cuadrante de estado
                }>{torneo.estado}</span>
            </div>

            <p>Inicio: {torneo.fechaInicio}</p>
            <p>Equipos: {torneo.cantidadEquipos} {"|"} Series: {torneo.series}</p>
            {torneo.proximaJornada !=null && (
                <p>Proxima Jornada : {torneo.proximaJornada}</p>
            )}

            {/* Abre la pantalla de Torneos con este torneo cargado para editar */}
            <button onClick={() => navegar(`/torneos?editar=${torneo.id}`)}>Ver Torneo</button>
            </div>
    );
}

export default TarjetaTorneo;