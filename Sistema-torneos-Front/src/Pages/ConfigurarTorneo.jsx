import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EncabezadoPagina from "../Components/EncabezadoPagina";
import Aviso from "../Components/Aviso";
import Tabla from "../Components/Tabla";
import Modal from "../Components/Modal";
import { consultarTorneo } from "../Services/torneoService.js";
import {
    listarFases,
    registrarFase,
    actualizarFase,
    eliminarFase,
    listarSeriesDelTorneo,
    registrarSerie,
    actualizarSerie,
    eliminarSerie,
} from "../Services/configuracionService.js";
import "./configuracion.css";

// Configurar torneo: organiza el torneo en fases y cada fase en series (RF-02 y RF-03)
function ConfigurarTorneo() {
    const { idTorneo } = useParams();
    const navegar = useNavigate();

    const [torneo, setTorneo] = useState(null);
    const [fases, setFases] = useState([]);
    const [series, setSeries] = useState([]);
    // Un solo modal para fase y serie: { tipo: "fase" | "serie", datos: {...} }
    const [modal, setModal] = useState(null);
    const [error, setError] = useState("");
    const [errorFormulario, setErrorFormulario] = useState("");
    const [exito, setExito] = useState("");

    async function cargarDatos() {
        try {
            const [datosTorneo, datosFases, datosSeries] = await Promise.all([
                consultarTorneo(idTorneo),
                listarFases(idTorneo),
                listarSeriesDelTorneo(idTorneo),
            ]);
            setTorneo(datosTorneo);
            setFases(datosFases);
            setSeries(datosSeries);
        } catch (e) {
            setError(e.message);
        }
    }

    useEffect(() => {
        cargarDatos();
    }, [idTorneo]);

    // Siguiente número de orden libre (1, 2, 3...)
    const siguienteOrden = (lista) => (lista.length ? Math.max(...lista.map((x) => x.orden)) + 1 : 1);
    const seriesDe = (idFase) => series.filter((s) => s.idFase === idFase);

    // ---------- Abrir el modal ----------
    function abrirNuevaFase() {
        setErrorFormulario("");
        setModal({
            tipo: "fase",
            datos: { idFase: null, idTorneo: Number(idTorneo), nombre: "", descripcion: "", orden: siguienteOrden(fases) },
        });
    }

    function abrirEditarFase(fase) {
        setErrorFormulario("");
        setModal({ tipo: "fase", datos: { ...fase, descripcion: fase.descripcion ?? "" } });
    }

    function abrirNuevaSerie(fase) {
        setErrorFormulario("");
        setModal({
            tipo: "serie",
            datos: { idSerie: null, idFase: fase.idFase, nombre: "", descripcion: "", orden: siguienteOrden(seriesDe(fase.idFase)) },
        });
    }

    function abrirEditarSerie(serie) {
        setErrorFormulario("");
        setModal({ tipo: "serie", datos: { ...serie, descripcion: serie.descripcion ?? "" } });
    }

    function cambiarCampo(e) {
        setModal({ ...modal, datos: { ...modal.datos, [e.target.name]: e.target.value } });
    }

    // ---------- Guardar fase o serie ----------
    async function guardar(e) {
        e.preventDefault();
        setErrorFormulario("");

        const datos = {
            ...modal.datos,
            orden: modal.datos.orden === "" ? null : Number(modal.datos.orden),
            descripcion: modal.datos.descripcion || null,
        };
        const esFase = modal.tipo === "fase";
        const esNuevo = esFase ? !datos.idFase : !datos.idSerie;

        try {
            if (esFase) {
                await (esNuevo ? registrarFase(datos) : actualizarFase(datos));
            } else {
                await (esNuevo ? registrarSerie(datos) : actualizarSerie(datos));
            }
            setExito(`${esFase ? "Fase" : "Serie"} ${esNuevo ? "registrada" : "actualizada"} correctamente`);
            setModal(null);
            cargarDatos();
        } catch (e) {
            setErrorFormulario(e.message);
        }
    }

    // ---------- Eliminar ----------
    async function borrarFase(fase) {
        if (!window.confirm(`¿Eliminar la fase "${fase.nombre}"?`)) return;
        setError("");
        setExito("");
        try {
            await eliminarFase(fase.idFase);
            setExito("Fase eliminada");
            cargarDatos();
        } catch (e) {
            // Ej.: "No se puede eliminar la fase: primero elimine sus series"
            setError(e.message);
        }
    }

    async function borrarSerie(serie) {
        if (!window.confirm(`¿Eliminar la serie "${serie.nombre}"?`)) return;
        setError("");
        setExito("");
        try {
            await eliminarSerie(serie.idSerie);
            setExito("Serie eliminada");
            cargarDatos();
        } catch (e) {
            // Ej.: "No se puede eliminar la serie: tiene equipos inscritos"
            setError(e.message);
        }
    }

    // ---------- Columnas de la tabla de series ----------
    const columnasSeries = [
        { titulo: "Orden", campo: "orden" },
        { titulo: "Nombre", campo: "nombre" },
        { titulo: "Descripcion", campo: "descripcion" },
        {
            titulo: "Acciones",
            render: (s) => (
                <div className="acciones">
                    <button className="btn btn-secundario" onClick={() => abrirEditarSerie(s)}>Editar</button>
                    <button className="btn btn-peligro" onClick={() => borrarSerie(s)}>Eliminar</button>
                </div>
            ),
        },
    ];

    if (!torneo) {
        return (
            <div className="contenedor-pagina">
                <Aviso tipo="error" mensaje={error} />
                {!error && <p>Cargando torneo...</p>}
            </div>
        );
    }

    const faseDelModal = modal?.tipo === "serie" ? fases.find((f) => f.idFase === modal.datos.idFase) : null;
    const editando = modal && (modal.tipo === "fase" ? modal.datos.idFase : modal.datos.idSerie);

    return (
        <div className="contenedor-pagina">
            <EncabezadoPagina titulo={`Configurar: ${torneo.nombre}`} descripcion="Organiza el torneo en fases y cada fase en series.">
                <button className="btn btn-secundario" onClick={() => navegar("/torneos")}>Volver a torneos</button>
                <button className="btn" onClick={abrirNuevaFase}>+ Nueva fase</button>
            </EncabezadoPagina>

            <Aviso tipo="error" mensaje={error} onCerrar={() => setError("")} />
            <Aviso tipo="exito" mensaje={exito} onCerrar={() => setExito("")} />

            {fases.length === 0 && (
                <div className="estado-vacio">
                    <p>Este torneo todavia no tiene fases. Empieza creando la primera, por ejemplo "Fase de grupos".</p>
                    <button className="btn" onClick={abrirNuevaFase}>+ Crear la primera fase</button>
                </div>
            )}

            {/* Una tarjeta por fase, con sus series dentro */}
            {fases.map((fase) => (
                <div key={fase.idFase} className="tarjeta-fase">
                    <div className="tarjeta-fase-encabezado">
                        <div>
                            <h2>
                                <span className="etiqueta-orden">Fase {fase.orden}</span>
                                {fase.nombre}
                            </h2>
                            {fase.descripcion && <p>{fase.descripcion}</p>}
                        </div>
                        <div className="acciones">
                            <button className="btn" onClick={() => abrirNuevaSerie(fase)}>+ Nueva serie</button>
                            <button className="btn btn-secundario" onClick={() => abrirEditarFase(fase)}>Editar</button>
                            <button className="btn btn-peligro" onClick={() => borrarFase(fase)}>Eliminar</button>
                        </div>
                    </div>

                    <Tabla
                        columnas={columnasSeries}
                        filas={seriesDe(fase.idFase)}
                        claveFila="idSerie"
                        mensajeVacio="Esta fase todavia no tiene series"
                    />
                </div>
            ))}

            {/* ---------- Modal de fase o serie ---------- */}
            <Modal
                abierto={modal !== null}
                titulo={`${editando ? "Editar" : "Nueva"} ${modal?.tipo === "fase" ? "fase" : "serie"}`}
                onCerrar={() => setModal(null)}
            >
                <Aviso tipo="error" mensaje={errorFormulario} />

                {modal && (
                    <form className="formulario" onSubmit={guardar}>
                        {faseDelModal && <p className="texto-suave">Pertenece a la fase: <b>{faseDelModal.nombre}</b></p>}

                        <div className="formulario-grilla">
                            <label className="campo">
                                Nombre *
                                <input
                                    name="nombre"
                                    maxLength={100}
                                    placeholder={modal.tipo === "fase" ? "Ej. Fase de grupos" : "Ej. Serie A"}
                                    value={modal.datos.nombre}
                                    onChange={cambiarCampo}
                                    autoFocus
                                />
                            </label>
                            <label className="campo">
                                Orden *
                                <input type="number" min="1" name="orden" value={modal.datos.orden} onChange={cambiarCampo} />
                            </label>
                        </div>

                        <label className="campo" style={{ marginTop: 14 }}>
                            Descripcion
                            <textarea name="descripcion" rows={3} maxLength={500} value={modal.datos.descripcion} onChange={cambiarCampo} />
                        </label>

                        <div className="formulario-botones">
                            <button type="button" className="btn btn-secundario" onClick={() => setModal(null)}>Cancelar</button>
                            <button type="submit" className="btn">{editando ? "Guardar cambios" : "Registrar"}</button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
}

export default ConfigurarTorneo;