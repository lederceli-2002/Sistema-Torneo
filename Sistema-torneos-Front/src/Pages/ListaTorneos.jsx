import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TarjetaTorneo from "../Components/TarjetaTorneo"
import EncabezadoPagina from "../Components/EncabezadoPagina";
import obtenerTorneos from "../Services/torneoService.js";

//Utilizamos una funcion de JS para crear la pagina y dentro armamos la pagina con JSX
function ListaTorneos(){
    const navegar = useNavigate();

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
            <EncabezadoPagina titulo="Torneos activos" descripcion="Torneos que se estan disputando actualmente">
                <button className="btn" onClick={()=>navegar("/torneos?nuevo")}>+ Nuevo torneo</button>
            </EncabezadoPagina>

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