//Creamos la funcion tarjetero de torneos 
function TarjetaTorneo({torneo}){
    return(
        <div className="tarjeta-torneo">

            <div className="tarjeta-encabezado">
                <h3>{torneo.nombre}</h3>
                <span>{torneo.estado}</span>
            </div>

            <p>Inicio: {torneo.fechaInicio}</p>
            <p>Equipos: {torneo.cantidadEquipos} {"|"} Series: {torneo.series}</p>
            {torneo.jornada !=null && (
                <p>Proxima Jornada : {torneo.proximaJornada}</p>
            )}
            
            <button>Ver Torneo</button>
            </div>
    );    
}

export default TarjetaTorneo;