import { pedir } from "./api.js";

export function listarEquipos() {
    return pedir("/equipos");
}

export function registrarEquipo(equipo) {
    return pedir("/equipos", { method: "POST", body: JSON.stringify(equipo) });
}

export function actualizarEquipo(equipo) {
    return pedir("/equipos", { method: "PUT", body: JSON.stringify(equipo) });
}

export function eliminarEquipo(id) {
    return pedir(`/equipos/${id}`, { method: "DELETE" });
}