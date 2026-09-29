import { pedir } from "./api.js";

// Lista los torneos con datos  mas resumidos
function obtenerTorneos() {
    return pedir("/torneos/tarjeteros");
}

export default obtenerTorneos;