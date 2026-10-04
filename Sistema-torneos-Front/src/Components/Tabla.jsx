import "./componentes.css";

// columnas: [{ titulo, campo }]  o  [{ titulo, render: (fila) => ... }]
// claveFila: nombre del campo que identifica cada fila (ej. "idJugador")
function Tabla({ columnas, filas, claveFila, mensajeVacio = "No hay datos para mostrar" }) {
    return (
        <div className="tabla-contenedor">
            <table className="tabla">
                <thead>
                    <tr>
                        {columnas.map((columna) => (
                            <th key={columna.titulo}>{columna.titulo}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filas.map((fila) => (
                        <tr key={fila[claveFila]}>
                            {columnas.map((columna) => (
                                <td key={columna.titulo}>
                                    {/* render permite mostrar botones o etiquetas en vez de texto */}
                                    {columna.render ? columna.render(fila) : (fila[columna.campo] ?? "-")}
                                </td>
                            ))}
                        </tr>
                    ))}
                    {filas.length === 0 && (
                        <tr>
                            <td colSpan={columnas.length} className="tabla-vacia">{mensajeVacio}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Tabla;