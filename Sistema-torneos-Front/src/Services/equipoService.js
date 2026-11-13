import { pedir } from "./api.js";

// 1. Listar todos los equipos (para la tabla principal)
export function listarEquipos() {
    return pedir("/equipos");
}       

// 2. Obtener datos de un equipo por su ID
export function obtenerEquipoPorId(id) {
    return pedir(`/equipos/${id}`);
}

// 3. Registro de equipo completo con su plantilla inicial (utilizado por el Wizard)
export function registrarEquipoConPlantilla(equipoData) {
    return pedir("/equipos/crear-con-plantilla", {
        method: "POST",
        body: JSON.stringify(equipoData)
    });
}

// 4. Actualizar datos institucionales del equipo (Nombre, Ciudad, Estado)
export function actualizarEquipo(id, equipoData) {
    return pedir(`/equipos/${id}`, {
        method: "PUT",
        body: JSON.stringify(equipoData)
    });
}

// 5. Eliminación en cascada del equipo (Elimina relaciones en EQUIPO_JUGADOR y el Equipo)
export function eliminarEquipo(id) {
    return pedir(`/equipos/${id}`, {
        method: "DELETE"
    });
}

// 6. Obtener la plantilla base de jugadores del equipo (EQUIPO_JUGADOR)
export function obtenerPlantillaEquipo(idEquipo) {
    return pedir(`/equipos/${idEquipo}/plantilla-base`);
}

// 7. Agregar un jugador individual a la plantilla base del club
export function agregarJugadorAPlantilla(idEquipo, payloadJugador) {
    return pedir(`/equipos/${idEquipo}/plantilla`, {
        method: "POST",
        body: JSON.stringify(payloadJugador)
    });
}

// 8. Remover un jugador individual de la plantilla base del club
export function removerJugadorDePlantilla(idEquipo, idJugador) {
    return pedir(`/equipos/${idEquipo}/plantilla/${idJugador}`, {
        method: "DELETE"
    });
}