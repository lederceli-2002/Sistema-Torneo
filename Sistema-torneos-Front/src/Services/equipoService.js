import { pedir } from "./api.js";
// Lista los equipos existentes
export function listarEquipos() {
    return pedir("/equipos");
}
//Posible eliminacion futura Auditoria
export function registrarEquipo(equipo) {
    return pedir("/equipos", { method: "POST", body: JSON.stringify(equipo) });
}
//Posible eliminacion futura Auditoria

//Registro de Equipos Funcional
export function registrarEquipoConPlantilla(equipoData) {
    return pedir("/equipos/crear-con-plantilla", { 
        method: "POST", 
        body: JSON.stringify(equipoData) 
    });
}

export function actualizarEquipo(equipo) {
    return pedir("/equipos", { method: "PUT", body: JSON.stringify(equipo) });
}

export function eliminarEquipo(id) {
    return pedir(`/equipos/${id}`, { method: "DELETE" });
}