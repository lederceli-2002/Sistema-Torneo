export const API_BASE = "http://localhost:8080/api";

// hace la peticion y si el backend responde con error,
// lanza mensaje de error.
export async function pedir(ruta, opciones = {}) {
    const respuesta = await fetch(API_BASE + ruta, {
        headers: { "Content-Type": "application/json" },
        ...opciones,
    });

    if (!respuesta.ok) {
        let mensaje = "Ocurrió un error en el servidor";
        try {
            const error = await respuesta.json();
            mensaje = error.message ?? mensaje;
        } catch {
            // la respuesta no trae cuerpo
        }
        throw new Error(mensaje);
    }

    return respuesta.json();
}