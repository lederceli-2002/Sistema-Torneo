import "./componentes.css";

// tipo: "exito" o "error". Si no hay mensaje, no se muestra nada.
function Aviso({ tipo = "exito", mensaje, onCerrar }) {
    if (!mensaje) return null;

    return (
        <div className={`aviso aviso-${tipo}`}>
            <span>{mensaje}</span>
            {onCerrar && (
                <button className="aviso-cerrar" onClick={onCerrar} aria-label="Cerrar aviso">
                    ×
                </button>
            )}
        </div>
    );
}

export default Aviso;