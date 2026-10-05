import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import EncabezadoPagina from "../Components/EncabezadoPagina";
import Aviso from "../Components/Aviso";
import Tabla from "../Components/Tabla";
import Modal from "../Components/Modal";
import EtiquetaEstado from "../Components/EtiquetaEstado";
import {
    listarTorneos,
    registrarTorneo,
    actualizarTorneo,
    eliminarTorneo,
} from "../Services/torneoService.js";

// Estados permitidos: deben coincidir con los que usa la pantalla de inicio
const estados = ["Programado", "En curso", "Finalizado"];

// Formulario vacío (idTorneo null = registrar, con id = editar)
const torneoVacio = {
    idTorneo: null,
    nombre: "",
    descripcion: "",
    fechaInicio: "",
    fechaFin: "",
    estado: "Programado",
};

// Convierte "2026-10-05" en "05/10/2026" para mostrarlo en la tabla
function formatearFecha(fecha) {
    if (!fecha) return "-";
    const [anio, mes, dia] = fecha.split("-");
    return `${dia}/${mes}/${anio}`;
}

function Torneos() {
    const [torneos, setTorneos] = useState([]);
    const [formulario, setFormulario] = useState(torneoVacio);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [error, setError] = useState("");
    const [errorFormulario, setErrorFormulario] = useState("");
    const [exito, setExito] = useState("");
    // Lee la URL: /torneos?editar=3  o  /torneos?nuevo
    const [parametros, setParametros] = useSearchParams();

    // Devuelve la lista para poder usarla justo después de cargarla
    async function cargarTorneos() {
        try {
            const lista = await listarTorneos();
            setTorneos(lista);
            return lista;
        } catch (e) {
            setError(e.message);
            return [];
        }
    }

    // Al abrir la pantalla: carga la lista y, si la URL lo pide, abre el modal
    useEffect(() => {
        async function iniciar() {
            const lista = await cargarTorneos();
            const idEditar = parametros.get("editar");

            if (idEditar) {
                const torneo = lista.find((t) => t.idTorneo === Number(idEditar));
                if (torneo) abrirEditar(torneo);
            } else if (parametros.has("nuevo")) {
                abrirNuevo();
            }
            // Limpia la URL para que al recargar no se vuelva a abrir el modal
            setParametros({}, { replace: true });
        }
        iniciar();
    }, []);

    // ---------- Abrir y cerrar el modal ----------
    function abrirNuevo() {
        setFormulario(torneoVacio);
        setErrorFormulario("");
        setModalAbierto(true);
    }

    function abrirEditar(torneo) {
        setFormulario({
            ...torneo,
            descripcion: torneo.descripcion ?? "",
            fechaInicio: torneo.fechaInicio ?? "",
            fechaFin: torneo.fechaFin ?? "",
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

        // Los campos vacíos se mandan como null para que el backend los valide
        const torneo = {
            ...formulario,
            descripcion: formulario.descripcion || null,
            fechaInicio: formulario.fechaInicio || null,
            fechaFin: formulario.fechaFin || null,
        };

        try {
            if (torneo.idTorneo) {
                await actualizarTorneo(torneo);
                setExito("Torneo actualizado correctamente");
            } else {
                await registrarTorneo(torneo);
                setExito("Torneo registrado correctamente");
            }
            setModalAbierto(false);
            cargarTorneos();
        } catch (e) {
            // Ej.: "Ya existe un torneo con el nombre: ..." o
            // "La fecha de fin no puede ser anterior a la fecha de inicio"
            setErrorFormulario(e.message);
        }
    }

    async function eliminar(torneo) {
        if (!window.confirm(`¿Eliminar el torneo "${torneo.nombre}"?`)) return;
        setError("");
        setExito("");
        try {
            await eliminarTorneo(torneo.idTorneo);
            setExito("Torneo eliminado");
            cargarTorneos();
        } catch (e) {
            // Ej.: "No se puede eliminar el torneo: tiene equipos inscritos"
            setError(e.message);
        }
    }

    // ---------- Búsqueda ----------
    const texto = busqueda.toLowerCase();
    const torneosFiltrados = torneos.filter((t) => t.nombre.toLowerCase().includes(texto));

    // ---------- Columnas de la tabla ----------
    const columnas = [
        { titulo: "Nombre", campo: "nombre" },
        { titulo: "Inicio", render: (t) => formatearFecha(t.fechaInicio) },
        { titulo: "Fin", render: (t) => formatearFecha(t.fechaFin) },
        { titulo: "Estado", render: (t) => <EtiquetaEstado estado={t.estado} /> },
        {
            titulo: "Acciones",
            render: (t) => (
                <div className="acciones">
                    <button className="btn btn-secundario" onClick={() => abrirEditar(t)}>Editar</button>
                    <button className="btn btn-peligro" onClick={() => eliminar(t)}>Eliminar</button>
                </div>
            ),
        },
    ];

    return (
        <div className="contenedor-pagina">
            <EncabezadoPagina titulo="Torneos" descripcion="Registro y mantenimiento de los torneos.">
                <button className="btn" onClick={abrirNuevo}>+ Nuevo torneo</button>
            </EncabezadoPagina>

            <Aviso tipo="error" mensaje={error} onCerrar={() => setError("")} />
            <Aviso tipo="exito" mensaje={exito} onCerrar={() => setExito("")} />

            <input
                className="buscador"
                placeholder="Buscar por nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
            />

            <Tabla
                columnas={columnas}
                filas={torneosFiltrados}
                claveFila="idTorneo"
                mensajeVacio="No hay torneos registrados"
            />

            {/* ---------- Modal de registro / edición ---------- */}
            <Modal
                abierto={modalAbierto}
                titulo={formulario.idTorneo ? "Editar torneo" : "Nuevo torneo"}
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
                            Estado *
                            <select name="estado" value={formulario.estado} onChange={cambiarCampo}>
                                {estados.map((estado) => (
                                    <option key={estado}>{estado}</option>
                                ))}
                            </select>
                        </label>
                        <label className="campo">
                            Fecha de inicio *
                            <input type="date" name="fechaInicio" value={formulario.fechaInicio} onChange={cambiarCampo} />
                        </label>
                        <label className="campo">
                            Fecha de fin *
                            <input type="date" name="fechaFin" value={formulario.fechaFin} onChange={cambiarCampo} />
                        </label>
                    </div>

                    <label className="campo" style={{ marginTop: 14 }}>
                        Descripción
                        <textarea
                            name="descripcion"
                            rows={3}
                            maxLength={500}
                            value={formulario.descripcion}
                            onChange={cambiarCampo}
                        />
                    </label>

                    <div className="formulario-botones">
                        <button type="button" className="btn btn-secundario" onClick={cerrarModal}>Cancelar</button>
                        <button type="submit" className="btn">
                            {formulario.idTorneo ? "Guardar cambios" : "Registrar"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default Torneos;