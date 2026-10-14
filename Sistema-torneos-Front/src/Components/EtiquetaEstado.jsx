import "./componentes.css";

// Color que corresponde a cada estado del sistema
const colores = {
    "Activo": "verde",
    "En curso": "verde",
    "Programado": "azul",
    "Pendiente": "amarillo",
    "Suspendido": "rojo",
    "Finalizado": "gris",
    "Inactivo": "gris",
    "Cumplida": "gris",
};

function EtiquetaEstado({ estado }) {
    const color = colores[estado] ?? "gris";
    return <span className={`etiqueta etiqueta-${color}`}>{estado}</span>;
}

export default EtiquetaEstado;