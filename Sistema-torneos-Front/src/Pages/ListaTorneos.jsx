import TarjetaTorneo from "../Components/TarjetaTorneo"
import obtenerTorneos from "../Services/torneoService.js";
import { useState, useEffect } from "react";

//Utilizamos una funcion de JS para crear la pagina y dentro armamos la pagina con JSX
function ListaTorneos(){
    //---CARGAMOS LOS TORNEOS EN "torneos"
    const [torneos,setTorneos]=useState([]);
    useEffect(()=>{
        async function cargarTorneos() {
            const datos = await obtenerTorneos();
            setTorneos(datos);
        }
        cargarTorneos();
    },[]); //se ejecuta al primer render gracias al "[]"

    //---Filtramos los torneos por su estado teniendo 2 listas
    const torneosActivos = torneos.filter((torneo)=>torneo.estado==="En curso");
    const otrosTorneo = torneos.filter((torneo)=> torneo.estado !== "En curso");

    return(
        <div className="contenedor-torneos">
            <h1>Torneos activos</h1>
            <p>Torneos que se estan disputando actualmente</p>

            <div className="lista-torneosActivos">
                {torneosActivos.map((torneo)=>(
                    <TarjetaTorneo key={torneo.id} torneo={torneo}/>
                ))}
            </div>

            <h2 className="titulo-otrosTorneos">Otros Torneos</h2>

            <div className="lista-TorneosOtros">
                {otrosTorneo.map((torneo)=>(
                    <TarjetaTorneo key={torneo.id} torneo={torneo}/>
                ))}
            </div>
        </div>
    )
}

export default ListaTorneos