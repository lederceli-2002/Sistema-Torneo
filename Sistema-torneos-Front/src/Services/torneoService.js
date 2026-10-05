import { pedir } from "./api.js";

// Lista los torneos con datos resumidos (tarjetas del inicio)
function obtenerTorneos() {
    return pedir("/torneos/tarjeteros");
}

export function listarTorneos() {
    return pedir("/torneos");
}

export function registrarTorneo(torneo) {
    return pedir("/torneos", { method: "POST", body: JSON.stringify(torneo) });
}

export function actualizarTorneo(torneo) {
    return pedir("/torneos", { method: "PUT", body: JSON.stringify(torneo) });
}

export function eliminarTorneo(id) {
    return pedir(`/torneos/${id}`, { method: "DELETE" });
}

export default obtenerTorneos;