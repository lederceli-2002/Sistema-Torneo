import { useEffect, useState } from "react";
import EncabezadoPagina from "../Components/EncabezadoPagina";
import Aviso from "../Components/Aviso";
import Tabla from "../Components/Tabla";
import Modal from "../Components/Modal";
import EtiquetaEstado from "../Components/EtiquetaEstado";
import {
    listarJugadores,
    registrarJugador,
    actualizarJugador,
    eliminarJugador,
} from "../Services/jugadorService.js";

// Formulario vacío (idJugador null = registrar, con id = editar)
const jugadorVacio = {
    idJugador: null,
    nombres: "",
    apellidos: "",
    fechaNacimiento: "",
    dni: "",
    nacionalidad: "",
    estado: "Activo",
};

function Jugadores() {
    const [jugadores, setJugadores] = useState([]);
    const [formulario, setFormulario] = useState(jugadorVacio);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [error, setError] = useState("");          // errores de la página
    const [errorFormulario, setErrorFormulario] = useState(""); // errores dentro del modal
    const [exito, setExito] = useState("");

    async function cargarJugadores() {
        try {
            setJugadores(await listarJugadores());
        } catch (e) {
            setError(e.message);
        }
    }

    // Carga la lista al abrir la pantalla
    useEffect(() => {
        cargarJugadores();
    }, []);

    // ---------- Abrir y cerrar el modal ----------
    function abrirNuevo() {
        setFormulario(jugadorVacio);
        setErrorFormulario("");
        setModalAbierto(true);
    }

    function abrirEditar(jugador) {
        setFormulario({
            ...jugador,
            fechaNacimiento: jugador.fechaNacimiento ?? "",
            dni: jugador.dni ?? "",
            nacionalidad: jugador.nacionalidad ?? "",
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
        const jugador = {
            ...formulario,
            fechaNacimiento: formulario.fechaNacimiento || null,
            dni: formulario.dni || null,
            nacionalidad: formulario.nacionalidad || null,
        };

        try {
            if (jugador.idJugador) {
                await actualizarJugador(jugador);
                setExito("Jugador actualizado correctamente");
            } else {
                await registrarJugador(jugador);
                setExito("Jugador registrado correctamente");
            }
            setModalAbierto(false);
            cargarJugadores();
        } catch (e) {
            // El error se muestra dentro del modal, sin cerrarlo
            setErrorFormulario(e.message);
        }
    }

    async function eliminar(jugador) {
        if (!window.confirm(`¿Eliminar a ${jugador.nombres} ${jugador.apellidos}?`)) return;
        setError("");
        setExito("");
        try {
            await eliminarJugador(jugador.idJugador);
            setExito("Jugador eliminado");
            cargarJugadores();
        } catch (e) {
            setError(e.message);
        }
    }

    // ---------- Búsqueda ----------
    const texto = busqueda.toLowerCase();
    const jugadoresFiltrados = jugadores.filter((j) =>
        `${j.nombres} ${j.apellidos} ${j.dni ?? ""}`.toLowerCase().includes(texto)
    );

    // ---------- Columnas de la tabla ----------
    const columnas = [
        { titulo: "Nombres", campo: "nombres" },
        { titulo: "Apellidos", campo: "apellidos" },
        { titulo: "DNI", campo: "dni" },
        { titulo: "Nacionalidad", campo: "nacionalidad" },
        { titulo: "Estado", render: (j) => <EtiquetaEstado estado={j.estado} /> },
        {
            titulo: "Acciones",
            render: (j) => (
                <div className="acciones">
                    <button className="btn btn-secundario" onClick={() => abrirEditar(j)}>Editar</button>
                    <button className="btn btn-peligro" onClick={() => eliminar(j)}>Eliminar</button>
                </div>
            ),
        },
    ];

    return (
        <div className="contenedor-pagina">
            <EncabezadoPagina titulo="Jugadores" descripcion="Registro y mantenimiento de los jugadores del torneo.">
                <button className="btn" onClick={abrirNuevo}>+ Nuevo jugador</button>
            </EncabezadoPagina>

            <Aviso tipo="error" mensaje={error} onCerrar={() => setError("")} />
            <Aviso tipo="exito" mensaje={exito} onCerrar={() => setExito("")} />

            <input
                className="buscador"
                placeholder="Buscar por nombre, apellido o DNI..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
            />

            <Tabla
                columnas={columnas}
                filas={jugadoresFiltrados}
                claveFila="idJugador"
                mensajeVacio="No hay jugadores para mostrar"
            />

            {/* ---------- Modal de registro / edición ---------- */}
            <Modal
                abierto={modalAbierto}
                titulo={formulario.idJugador ? "Editar jugador" : "Nuevo jugador"}
                onCerrar={cerrarModal}
            >
                <Aviso tipo="error" mensaje={errorFormulario} />

                <form className="formulario" onSubmit={guardar}>
                    <div className="formulario-grilla">
                        <label className="campo">
                            Nombres *
                            <input name="nombres" value={formulario.nombres} onChange={cambiarCampo} autoFocus />
                        </label>
                        <label className="campo">
                            Apellidos *
                            <input name="apellidos" value={formulario.apellidos} onChange={cambiarCampo} />
                        </label>
                        <label className="campo">
                            Fecha de nacimiento
                            <input type="date" name="fechaNacimiento" value={formulario.fechaNacimiento} onChange={cambiarCampo} />
                        </label>
                        <label className="campo">
                            DNI
                            <input name="dni" maxLength={20} value={formulario.dni} onChange={cambiarCampo} />
                        </label>
                        <label className="campo">
                            Nacionalidad
                            <input name="nacionalidad" value={formulario.nacionalidad} onChange={cambiarCampo} />
                        </label>
                        <label className="campo">
                            Estado *
                            <select name="estado" value={formulario.estado} onChange={cambiarCampo}>
                                <option>Activo</option>
                                <option>Inactivo</option>
                            </select>
                        </label>
                    </div>

                    <div className="formulario-botones">
                        <button type="button" className="btn btn-secundario" onClick={cerrarModal}>Cancelar</button>
                        <button type="submit" className="btn">
                            {formulario.idJugador ? "Guardar cambios" : "Registrar"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default Jugadores;