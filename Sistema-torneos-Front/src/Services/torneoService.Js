const API_URL = "http://localhost:8080/api/torneos/tarjeteros";

async function obtenerTorneos() {
    const respuesta = await fetch(API_URL);
    if(!respuesta.ok){
        throw new Error("Error al obtener los torneos");
    }
    const torneos = await respuesta.json();
    return torneos;
}

export default obtenerTorneos;