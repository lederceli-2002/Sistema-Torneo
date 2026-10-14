import "./componentes.css";

// children: botones que van a la derecha del título
function EncabezadoPagina({ titulo, descripcion, children }) {
    return (
        <div className="encabezado-pagina">
            <div>
                <h1>{titulo}</h1>
                {descripcion && <p>{descripcion}</p>}
            </div>
            {children && <div className="encabezado-acciones">{children}</div>}
        </div>
    );
}

export default EncabezadoPagina;