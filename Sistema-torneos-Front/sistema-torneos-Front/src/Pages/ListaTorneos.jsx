import TarjetaTorneo from "../Components/TarjetaTorneo"
import SideBar from "../Components/SideBar";
//LISTA TEMPORAL
const listaTorneos = [
       {
        id: 1,
        nombre: "Torneo Apertura 2025",
        estado: "En curso",
        fechaInicio: "10/03/2025",
        cantidadEquipos: 12,
        cantidadSeries: 2,
        proximaJornada: 4
    },
    {
        id: 2,
        nombre: "Torneo Clausura 2025",
        estado: "En curso",
        fechaInicio: "01/09/2025",
        cantidadEquipos: 10,
        cantidadSeries: 1,
        proximaJornada: 1
    },
    {
        id: 3,
        nombre: "Torneo Amistoso 2024",
        estado: "Finalizado",
        fechaInicio: "05/03/2024",
        cantidadEquipos: 8,
        cantidadSeries: 1,
        proximaJornada: null
    }    
];
    
//Utilizamos una funcion de JS para crear la pagina y dentro armamos la pagina con JSX
function ListaTorneos(){
    return(
        <div className="pagina">

        <SideBar/>

        <main className="contenido">
            <h1>Sistema de torneos</h1>
            <h2>Torneos activos</h2>
            {/*llamamos al componente TarjetaTorneo*/}
            {listaTorneos.map((torneo)=>(
                <TarjetaTorneo
                    key={torneo.id}
                    torneo={torneo}
                />
            ))}
        </main>                           
        </div>
    )
}
 
//Exportamos la pagina para poder importala de otro lado 
//(solo se puede hacer un expor defaul por pagina) 
export default ListaTorneos