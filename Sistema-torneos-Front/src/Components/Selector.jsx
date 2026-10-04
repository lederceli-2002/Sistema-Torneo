import "./componentes.css";

// opciones: [{ valor, texto }]
function Selector({ etiqueta, valor, opciones, onCambiar, textoVacio = "Seleccione..." }) {
    return (
        <label className="campo">
            {etiqueta}
            <select value={valor ?? ""} onChange={(e) => onCambiar(e.target.value)}>
                <option value="">{textoVacio}</option>
                {opciones.map((opcion) => (
                    <option key={opcion.valor} value={opcion.valor}>{opcion.texto}</option>
                ))}
            </select>
        </label>
    );
}

export default Selector;