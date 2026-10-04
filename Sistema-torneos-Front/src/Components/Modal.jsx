import { useEffect } from "react";
import "./componentes.css";

function Modal({ abierto, titulo, onCerrar, children }) {
    // Cierra el modal con la tecla Escape
    useEffect(() => {
        if (!abierto) return;
        function alPresionarTecla(e) {
            if (e.key === "Escape") onCerrar();
        }
        window.addEventListener("keydown", alPresionarTecla);
        return () => window.removeEventListener("keydown", alPresionarTecla);
    }, [abierto, onCerrar]);

    if (!abierto) return null;

    return (
        // Clic en el fondo oscuro = cerrar
        <div className="modal-fondo" onClick={onCerrar}>
            {/* stopPropagation evita que un clic dentro del modal lo cierre */}
            <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
                <div className="modal-encabezado">
                    <h2>{titulo}</h2>
                    <button className="modal-cerrar" onClick={onCerrar} aria-label="Cerrar">×</button>
                </div>
                <div className="modal-cuerpo">{children}</div>
            </div>
        </div>
    );
}

export default Modal;