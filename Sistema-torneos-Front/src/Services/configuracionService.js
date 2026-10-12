import { pedir } from "./api.js";

// ---------- Fases ----------
export function listarFases(idTorneo) {
    return pedir(`/fases?idTorneo=${idTorneo}`);
}

export function registrarFase(fase) {
    return pedir("/fases", { method: "POST", body: JSON.stringify(fase) });
}

export function actualizarFase(fase) {
    return pedir("/fases", { method: "PUT", body: JSON.stringify(fase) });
}

export function eliminarFase(id) {
    return pedir(`/fases/${id}`, { method: "DELETE" });
}

// ---------- Series ----------
export function listarSeriesDelTorneo(idTorneo) {
    return pedir(`/series?idTorneo=${idTorneo}`);
}

export function registrarSerie(serie) {
    return pedir("/series", { method: "POST", body: JSON.stringify(serie) });
}

export function actualizarSerie(serie) {
    return pedir("/series", { method: "PUT", body: JSON.stringify(serie) });
}

export function eliminarSerie(id) {
    return pedir(`/series/${id}`, { method: "DELETE" });
}