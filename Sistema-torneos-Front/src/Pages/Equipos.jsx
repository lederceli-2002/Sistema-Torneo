import { useEffect, useState } from "react";
import EncabezadoPagina from "../Components/EncabezadoPagina";
import Aviso from "../Components/Aviso";
import Tabla from "../Components/Tabla";
import Modal from "../Components/Modal";
import EtiquetaEstado from "../Components/EtiquetaEstado";
import {
    listarEquipos,
    registrarEquipo,
    actualizarEquipo,
    eliminarEquipo,
} from "../Services/equipoService.js";

// Formulario vacío (idEquipo null = registrar, con id = editar)
const equipoVacio = {
    idEquipo: null,
    nombre: "",
    ciudad: "",
    escudo: "",
    descripcion: "",
    estado: "Activo",
};

// Escudo pequeño para la tabla; si no hay imagen, muestra la inicial del equipo
function Escudo({ equipo }) {
    const estilo = {
        width: 32, height: 32, borderRadius: "50%", objectFit: "cover",
        display: "flex", alignItems: "center", justifyContent: "center",
        backgroundColor: "#e7ebf0", color: "#263746", fontWeight: "bold",
    };
    if (equipo.escudo) {
        return <img src={equipo.escudo} alt={`Escudo de ${equipo.nombre}`} style={estilo} />;
    }
    return <div style={estilo}>{equipo.nombre.charAt(0).toUpperCase()}</div>;
}

function Equipos() {
    const [equipos, setEquipos] = useState([]);
    const [formulario, setFormulario] = useState(equipoVacio);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [error, setError] = useState("");
    const [errorFormulario, setErrorFormulario] = useState("");
    const [exito, setExito] = useState("");

    async function cargarEquipos() {
        try {
            setEquipos(await listarEquipos());
        } catch (e) {
            setError(e.message);
        }
    }

    // Carga la lista al abrir la pantalla
    useEffect(() => {
        cargarEquipos();
    }, []);

    // ---------- Abrir y cerrar el modal ----------
    function abrirNuevo() {
        setFormulario(equipoVacio);
        setErrorFormulario("");
        setModalAbierto(true);
    }

    function abrirEditar(equipo) {
        setFormulario({
            ...equipo,
            ciudad: equipo.ciudad ?? "",
            escudo: equipo.escudo ?? "",
            descripcion: equipo.descripcion ?? "",
        });
        setErrorFormulario("");
        setModalAbierto(true);
    }

    function cerrarModal() {
        setModalAbierto(false);
    }

    // ---------- Formulario ----------
    function cambiarCampo(e) {
        setFormulario({ ...formulario, [e.target.name]: e.target.value });
    }

    async function guardar(e) {
        e.preventDefault();
        setErrorFormulario("");

        // Los campos opcionales vacíos se mandan como null
        const equipo = {
            ...formulario,
            ciudad: formulario.ciudad || null,
            escudo: formulario.escudo || null,
            descripcion: formulario.descripcion || null,
        };

        try {
            if (equipo.idEquipo) {
                await actualizarEquipo(equipo);
                setExito("Equipo actualizado correctamente");
            } else {
                await registrarEquipo(equipo);
                setExito("Equipo registrado correctamente");
            }
            setModalAbierto(false);
            cargarEquipos();
        } catch (e) {
            // Ej.: "Ya existe un equipo con el nombre: ..."
            setErrorFormulario(e.message);
        }
    }

    async function eliminar(equipo) {
        if (!window.confirm(`¿Eliminar el equipo "${equipo.nombre}"?`)) return;
        setError("");
        setExito("");
        try {
            await eliminarEquipo(equipo.idEquipo);
            setExito("Equipo eliminado");
            cargarEquipos();
        } catch (e) {
            // Ej.: "No se puede eliminar el equipo: esta inscrito en un torneo"
            setError(e.message);
        }
    }

    // ---------- Búsqueda ----------
    const texto = busqueda.toLowerCase();
    const equiposFiltrados = equipos.filter((e) =>
        `${e.nombre} ${e.ciudad ?? ""}`.toLowerCase().includes(texto)
    );

    // ---------- Columnas de la tabla ----------
    const columnas = [
        { titulo: "Escudo", render: (e) => <Escudo equipo={e} /> },
        { titulo: "Nombre", campo: "nombre" },
        { titulo: "Ciudad", campo: "ciudad" },
        { titulo: "Estado", render: (e) => <EtiquetaEstado estado={e.estado} /> },
        {
            titulo: "Acciones",
            render: (e) => (
                <div className="acciones">
                    <button className="btn btn-secundario" onClick={() => abrirEditar(e)}>Editar</button>
                    <button className="btn btn-peligro" onClick={() => eliminar(e)}>Eliminar</button>
                </div>
            ),
        },
    ];

    return (
        <div className="contenedor-pagina">
            <EncabezadoPagina titulo="Equipos" descripcion="Registro y mantenimiento de los equipos.">
                <button className="btn" onClick={abrirNuevo}>+ Nuevo equipo</button>
            </EncabezadoPagina>

            <Aviso tipo="error" mensaje={error} onCerrar={() => setError("")} />
            <Aviso tipo="exito" mensaje={exito} onCerrar={() => setExito("")} />

            <input
                className="buscador"
                placeholder="Buscar por nombre o ciudad..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
            />

            <Tabla
                columnas={columnas}
                filas={equiposFiltrados}
                claveFila="idEquipo"
                mensajeVacio="No hay equipos registrados"
            />

            {/* ---------- Modal de registro / edición ---------- */}
            <Modal
                abierto={modalAbierto}
                titulo={formulario.idEquipo ? "Editar equipo" : "Nuevo equipo"}
                onCerrar={cerrarModal}
            >
                <Aviso tipo="error" mensaje={errorFormulario} />

                <form className="formulario" onSubmit={guardar}>
                    <div className="formulario-grilla">
                        <label className="campo">
                            Nombre *
                            <input name="nombre" maxLength={150} value={formulario.nombre} onChange={cambiarCampo} autoFocus />
                        </label>
                        <label className="campo">
                            Ciudad
                            <input name="ciudad" maxLength={100} value={formulario.ciudad} onChange={cambiarCampo} />
                        </label>
                        <label className="campo">
                            URL del escudo
                            <input name="escudo" maxLength={500} placeholder="https://..." value={formulario.escudo} onChange={cambiarCampo} />
                        </label>
                        <label className="campo">
                            Estado *
                            <select name="estado" value={formulario.estado} onChange={cambiarCampo}>
                                <option>Activo</option>
                                <option>Inactivo</option>
                            </select>
                        </label>
                    </div>

                    <label className="campo" style={{ marginTop: 14 }}>
                        Descripción
                        <textarea name="descripcion" rows={3} maxLength={500} value={formulario.descripcion} onChange={cambiarCampo} />
                    </label>

                    <div className="formulario-botones">
                        <button type="button" className="btn btn-secundario" onClick={cerrarModal}>Cancelar</button>
                        <button type="submit" className="btn">
                            {formulario.idEquipo ? "Guardar cambios" : "Registrar"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default Equipos;