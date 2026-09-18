//Creamos la funcion tarjetero de torneos 
function TarjetaTorneo({torneo}){
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
            
            <button>Ver Torneo</button>
            </div>
    );    
}

export default TarjetaTorneo;