import { pedir } from "./api.js";

export function listarJugadores() {
    return pedir("/jugadores");
}

export function registrarJugador(jugador) {
    return pedir("/jugadores", { method: "POST", body: JSON.stringify(jugador) });
}

export function actualizarJugador(jugador) {
    return pedir("/jugadores", { method: "PUT", body: JSON.stringify(jugador) });
}

export function eliminarJugador(id) {
    return pedir(`/jugadores/${id}`, { method: "DELETE" });
}