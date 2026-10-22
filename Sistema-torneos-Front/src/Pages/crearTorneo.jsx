import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrarTorneoCompleto, obtenerEquiposDisponibles } from '../Services/registroTorneoService';
import axios from 'axios';

export default function CrearTorneo() {
    const navigate = useNavigate();
    const [paso, setPaso] = useState(1);
    const [loading, setLoading] = useState(false);
    
    // Lista base de equipos y jugadores obtenida del Backend
    const [equiposBase, setEquiposBase] = useState([]);
    const [jugadoresBase, setJugadoresBase] = useState([]);

    // Estado para controlar el texto del buscador de equipos
    const [textoBusquedaEquipo, setTextoBusquedaEquipo] = useState({});

    // Estado para el MODAL de seleccion de jugadores
    const [modalAbierto, setModalAbierto] = useState(false);
    const [equipoSeleccionadoModal, setEquipoSeleccionadoModal] = useState(null);
    const [textoBusquedaJugadorModal, setTextoBusquedaJugadorModal] = useState('');

    // Estado para almacenar el Fixture Generado antes de registrar
    const [fixtureGenerado, setFixtureGenerado] = useState(null);

    // Estado general del torneo
    const [formTorneo, setFormTorneo] = useState({
        nombre: '',
        descripcion: '',
        fechaInicio: '',
        fechaFin: '',
        formato: 'Fase de grupos (series)',
        cantidadSeries: 2,
        series: [
            { nombre: 'Serie A', equipos: [] },
            { nombre: 'Serie B', equipos: [] }
        ]
    });

    useEffect(() => {
        async function cargarDatos() {
            // Cargar lista de equipos desde EquipoController
            const dataEquipos = await obtenerEquiposDisponibles();
            if (Array.isArray(dataEquipos)) {
                setEquiposBase(dataEquipos);
            }

            // Cargar lista general de jugadores desde JugadorController
            try {
                const responseJugadores = await axios.get('http://localhost:8080/api/jugadores');
                if (Array.isArray(responseJugadores.data)) {
                    setJugadoresBase(responseJugadores.data);
                }
            } catch (error) {
                console.error("Error al cargar lista de jugadores:", error);
            }
        }
        cargarDatos();
    }, []);

    const handleChangeDatos = (e) => {
        const { name, value } = e.target;
        setFormTorneo(prev => ({ ...prev, [name]: value }));
    };

    // --- MANEJO DE EQUIPOS ---
    const handleTextoEquipoChange = (sIdx, valor) => {
        setTextoBusquedaEquipo(prev => ({ ...prev, [sIdx]: valor }));
    };

    const handleAgregarEquipoASerie = (sIdx) => {
        const nombreIngresado = textoBusquedaEquipo[sIdx];
        if (!nombreIngresado) return;

        const equipoObj = equiposBase.find(eq => eq.nombre.trim().toLowerCase() === nombreIngresado.trim().toLowerCase());
        if (!equipoObj) return;

        setFormTorneo(prev => {
            const nuevasSeries = [...prev.series];
            const eqId = equipoObj.idEquipo || equipoObj.id_equipo || equipoObj.id;

            const yaExiste = nuevasSeries[sIdx].equipos.some(e => (e.idEquipo || e.id_equipo || e.id) === eqId);
            if (!yaExiste) {
                nuevasSeries[sIdx].equipos.push({
                    ...equipoObj,
                    jugadoresInscritos: []
                });
            }
            return { ...prev, series: nuevasSeries };
        });

        // Al modificar equipos, reiniciamos el fixture generado previo
        setFixtureGenerado(null);
        setTextoBusquedaEquipo(prev => ({ ...prev, [sIdx]: '' }));
    };

    const handleRemoverEquipoDeSerie = (indexSerie, idEquipo) => {
        setFormTorneo(prev => {
            const nuevasSeries = [...prev.series];
            nuevasSeries[indexSerie].equipos = nuevasSeries[indexSerie].equipos.filter(
                e => (e.idEquipo || e.id_equipo || e.id) !== idEquipo
            );
            return { ...prev, series: nuevasSeries };
        });
        setFixtureGenerado(null);
    };

    // --- MANEJO DEL MODAL DE JUGADORES ---
    const handleAbrirModalJugadores = (sIdx, eqIdx) => {
        const equipo = formTorneo.series[sIdx].equipos[eqIdx];
        setEquipoSeleccionadoModal({ sIdx, eqIdx, equipo });
        setTextoBusquedaJugadorModal('');
        setModalAbierto(true);
    };

    const handleCerrarModal = () => {
        setModalAbierto(false);
        setEquipoSeleccionadoModal(null);
    };

    const handleAgregarJugadorAEquipoModal = () => {
        if (!equipoSeleccionadoModal || !textoBusquedaJugadorModal) return;

        const { sIdx, eqIdx } = equipoSeleccionadoModal;

        const jugadorObj = jugadoresBase.find(j => {
            const nombreCompleto = `${j.nombres || ''} ${j.apellidos || ''}`.trim().toLowerCase();
            return nombreCompleto === textoBusquedaJugadorModal.trim().toLowerCase() || j.nombres?.trim().toLowerCase() === textoBusquedaJugadorModal.trim().toLowerCase();
        });

        if (!jugadorObj) return;

        setFormTorneo(prev => {
            const nuevasSeries = [...prev.series];
            const jId = jugadorObj.idJugador || jugadorObj.id_jugador || jugadorObj.id;
            const listaJugadores = nuevasSeries[sIdx].equipos[eqIdx].jugadoresInscritos || [];

            const yaExiste = listaJugadores.some(j => (j.idJugador || j.id_jugador || j.id) === jId);
            if (!yaExiste) {
                nuevasSeries[sIdx].equipos[eqIdx].jugadoresInscritos.push(jugadorObj);
            }
            return { ...prev, series: nuevasSeries };
        });

        setEquipoSeleccionadoModal(prev => ({
            ...prev,
            equipo: {
                ...prev.equipo,
                jugadoresInscritos: [...(prev.equipo.jugadoresInscritos || []), jugadorObj]
            }
        }));

        setTextoBusquedaJugadorModal('');
    };

    const handleRemoverJugadorDeEquipoModal = (idJugador) => {
        if (!equipoSeleccionadoModal) return;

        const { sIdx, eqIdx } = equipoSeleccionadoModal;

        setFormTorneo(prev => {
            const nuevasSeries = [...prev.series];
            nuevasSeries[sIdx].equipos[eqIdx].jugadoresInscritos = nuevasSeries[sIdx].equipos[eqIdx].jugadoresInscritos.filter(
                j => (j.idJugador || j.id_jugador || j.id) !== idJugador
            );
            return { ...prev, series: nuevasSeries };
        });

        setEquipoSeleccionadoModal(prev => ({
            ...prev,
            equipo: {
                ...prev.equipo,
                jugadoresInscritos: prev.equipo.jugadoresInscritos.filter(j => (j.idJugador || j.id_jugador || j.id) !== idJugador)
            }
        }));
    };

    // --- ALGORITMO DE GENERACIÓN DE FIXTURE (ROUND-ROBIN) ---
    const generarCalendarioRoundRobin = (listaEquipos) => {
        if (!listaEquipos || listaEquipos.length < 2) return [];

        let equipos = [...listaEquipos];
        // Si el número de equipos es impar, agregamos un comodín "Descansa"
        const esImpar = equipos.length % 2 !== 0;
        if (esImpar) {
            equipos.push({ id: 'BYE', nombre: 'DESCANSA' });
        }

        const numEquipos = equipos.length;
        const totalJornadas = numEquipos - 1;
        const partidosPorJornada = numEquipos / 2;
        const fixtureJornadas = [];

        // Generación mediante rotación de lista
        for (let j = 0; j < totalJornadas; j++) {
            const jornada = {
                numeroJornada: j + 1,
                partidos: []
            };

            for (let i = 0; i < partidosPorJornada; i++) {
                const local = equipos[i];
                const visitante = equipos[numEquipos - 1 - i];

                // Ignoramos emparejamientos que incluyan el comodín de descanso en la lista de partidos visibles
                if (local.id !== 'BYE' && visitante.id !== 'BYE') {
                    jornada.partidos.push({
                        equipoLocal: local,
                        equipoVisitante: visitante
                    });
                }
            }

            fixtureJornadas.push(jornada);

            // Rotamos los equipos manteniendo fijo el primer elemento (equipos[0])
            equipos.splice(1, 0, equipos.pop());
        }

        return fixtureJornadas;
    };

    const handleProgramarFixture = () => {
        // Generar fixture independiente por cada serie
        const fixturePorSeries = formTorneo.series.map(serie => ({
            nombreSerie: serie.nombre,
            jornadas: generarCalendarioRoundRobin(serie.equipos)
        }));

        setFixtureGenerado(fixturePorSeries);
    };

    // Función para procesar y enviar la creación del torneo
const handleGuardarTorneo = async (e) => {
    if (e) e.preventDefault();

    // Validaciones básicas de formulario
    if (!formTorneo.nombre || !formTorneo.fechaInicio || !formTorneo.fechaFin) {
        alert("Por favor completa los campos obligatorios del torneo.");
        return;
    }

    // Tomamos el fixture generado o las series configuradas en el estado
    const payloadSeries = fixtureGenerado || formTorneo.series;

    if (!payloadSeries || payloadSeries.length === 0) {
        alert("Debes configurar al menos una serie con sus equipos asignados.");
        return;
    }

    try {
        setLoading(true);

        // 1. Envío asíncrono al endpoint /api/torneos/crear-con-fixture
        await registrarTorneoCompleto(formTorneo, payloadSeries);

        alert("¡Torneo y fixture registrados exitosamente!");

        // 2. Transición a la pantalla principal únicamente tras confirmación del servidor (201 Created)
        navigate('/');
    } catch (error) {
        console.error("Error al registrar el torneo:", error);

        const mensajeError =
            error.response?.data?.message ||
            error.response?.data ||
            "Ocurrió un error al procesar el registro en el servidor.";

        alert(`No se pudo registrar el torneo: ${mensajeError}`);
    } finally {
        setLoading(false);
    }
};
    const totalEquiposInscritos = formTorneo.series.reduce((acc, s) => acc + s.equipos.length, 0);

    return (
        <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            <h2>Crear Nuevo Torneo</h2>

            {/* Indicador de pasos */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', borderBottom: '1px solid #ddd', paddingBottom: '15px' }}>
                <span style={{ fontWeight: paso === 1 ? 'bold' : 'normal', color: paso === 1 ? '#007bff' : '#666' }}>1. Datos Generales</span>
                <span style={{ fontWeight: paso === 2 ? 'bold' : 'normal', color: paso === 2 ? '#007bff' : '#666' }}>2. Series y Equipos</span>
                <span style={{ fontWeight: paso === 3 ? 'bold' : 'normal', color: paso === 3 ? '#007bff' : '#666' }}>3. Confirmar y Fixture</span>
            </div>

            {/* PASO 1 */}
            {paso === 1 && (
                <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Nombre del torneo *</label>
                        <input type="text" name="nombre" value={formTorneo.nombre} onChange={handleChangeDatos} placeholder="Ej: Campeonato del Agustino 2026" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} required />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Descripción (opcional)</label>
                        <textarea name="descripcion" value={formTorneo.descripcion} onChange={handleChangeDatos} rows="3" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Fecha de inicio *</label>
                            <input type="date" name="fechaInicio" value={formTorneo.fechaInicio} onChange={handleChangeDatos} style={{ width: '100%', padding: '8px' }} required />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Fecha de fin (estimada) *</label>
                            <input type="date" name="fechaFin" value={formTorneo.fechaFin} onChange={handleChangeDatos} style={{ width: '100%', padding: '8px' }} required />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Formato</label>
                            <select name="formato" value={formTorneo.formato} onChange={handleChangeDatos} style={{ width: '100%', padding: '8px' }}>
                                <option value="Fase de grupos (series)">Fase de grupos (series)</option>
                                <option value="Todos contra todos">Todos contra todos</option>
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Cantidad de series</label>
                            <select name="cantidadSeries" value={formTorneo.cantidadSeries} onChange={handleChangeDatos} style={{ width: '100%', padding: '8px' }}>
                                <option value={2}>2 Series</option>
                                <option value={4}>4 Series</option>
                            </select>
                        </div>
                    </div>

                    <button onClick={() => setPaso(2)} disabled={!formTorneo.nombre || !formTorneo.fechaInicio} style={{ background: '#007bff', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>
                        Siguiente &rarr;
                    </button>
                </div>
            )}

            {/* PASO 2 */}
            {paso === 2 && (
                <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3>Asignación de Equipos por Serie</h3>

                    <datalist id="lista-equipos-disponibles">
                        {equiposBase.map((eq) => {
                            const idReal = eq.idEquipo || eq.id_equipo || eq.id;
                            return <option key={idReal} value={eq.nombre} />;
                        })}
                    </datalist>

                    <datalist id="lista-jugadores-disponibles">
                        {jugadoresBase.map((j) => {
                            const jId = j.idJugador || j.id_jugador || j.id;
                            const nombreMostrar = `${j.nombres || ''} ${j.apellidos || ''}`.trim() || j.nombre;
                            return <option key={jId} value={nombreMostrar} />;
                        })}
                    </datalist>

                    {formTorneo.series.map((serie, sIdx) => (
                        <div key={sIdx} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '6px', marginBottom: '20px', background: '#fafafa' }}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>{serie.nombre}</h4>

                            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                                <input
                                    type="text"
                                    list="lista-equipos-disponibles"
                                    placeholder="Haga clic para ver todos los equipos o escriba para buscar..."
                                    value={textoBusquedaEquipo[sIdx] || ''}
                                    onChange={(e) => handleTextoEquipoChange(sIdx, e.target.value)}
                                    style={{ flex: 1, padding: '8px', boxSizing: 'border-box' }}
                                />

                                <button
                                    type="button"
                                    onClick={() => handleAgregarEquipoASerie(sIdx)}
                                    style={{ background: '#28a745', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    + Añadir Equipo
                                </button>
                            </div>

                            {serie.equipos.map((eq, eqIdx) => {
                                const eqId = eq.idEquipo || eq.id_equipo || eq.id;
                                const cantJugadores = eq.jugadoresInscritos ? eq.jugadoresInscritos.length : 0;
                                return (
                                    <div key={eqId} style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '5px', padding: '10px 15px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <strong style={{ fontSize: '15px', color: '#333' }}>{eq.nombre}</strong>
                                            <span style={{ marginLeft: '10px', fontSize: '12px', color: '#666', background: '#e9ecef', padding: '2px 8px', borderRadius: '10px' }}>
                                                {cantJugadores} jugador(es)
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                type="button"
                                                onClick={() => handleAbrirModalJugadores(sIdx, eqIdx)}
                                                style={{ background: '#17a2b8', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 12px', fontSize: '13px', cursor: 'pointer' }}
                                            >
                                                Seleccionar Jugadores
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoverEquipoDeSerie(sIdx, eqId)}
                                                style={{ background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 12px', fontSize: '13px', cursor: 'pointer' }}
                                            >
                                                Quitar Equipo
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                        <button onClick={() => setPaso(1)} style={{ background: '#6c757d', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>
                            &larr; Volver
                        </button>
                        <button onClick={() => setPaso(3)} style={{ background: '#007bff', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>
                            Siguiente &rarr;
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL EMERGENTE PARA SELECCION DE JUGADORES */}
            {modalAbierto && equipoSeleccionadoModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000
                }}>
                    <div style={{
                        background: '#fff',
                        borderRadius: '8px',
                        padding: '25px',
                        width: '100%',
                        maxWidth: '550px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                        maxHeight: '85vh',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '15px' }}>
                            <h3 style={{ margin: 0, color: '#007bff' }}>
                                Jugadores de {equipoSeleccionadoModal.equipo.nombre}
                            </h3>
                            <button onClick={handleCerrarModal} style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}>
                                &times;
                            </button>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                            <input
                                type="text"
                                list="lista-jugadores-disponibles"
                                placeholder="Escriba o busque un jugador..."
                                value={textoBusquedaJugadorModal}
                                onChange={(e) => setTextoBusquedaJugadorModal(e.target.value)}
                                style={{ flex: 1, padding: '8px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                            <button
                                type="button"
                                onClick={handleAgregarJugadorAEquipoModal}
                                style={{ background: '#28a745', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
                            >
                                + Agregar
                            </button>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #eee', borderRadius: '4px', padding: '10px', marginBottom: '15px' }}>
                            <strong style={{ fontSize: '13px', color: '#555', display: 'block', marginBottom: '8px' }}>
                                Jugadores Inscritos ({equipoSeleccionadoModal.equipo.jugadoresInscritos ? equipoSeleccionadoModal.equipo.jugadoresInscritos.length : 0}):
                            </strong>

                            {equipoSeleccionadoModal.equipo.jugadoresInscritos && equipoSeleccionadoModal.equipo.jugadoresInscritos.length > 0 ? (
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {equipoSeleccionadoModal.equipo.jugadoresInscritos.map(j => {
                                        const jId = j.idJugador || j.id_jugador || j.id;
                                        const nombreJ = `${j.nombres || ''} ${j.apellidos || ''}`.trim() || j.nombre;
                                        return (
                                            <li key={jId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', borderBottom: '1px solid #f0f0f0' }}>
                                                <span style={{ fontSize: '14px' }}>
                                                    {nombreJ} {j.dni ? <small style={{ color: '#777' }}>(DNI: {j.dni})</small> : ''}
                                                </span>
                                                <button
                                                    onClick={() => handleRemoverJugadorDeEquipoModal(jId)}
                                                    style={{ background: '#dc3545', color: '#fff', border: 'none', borderRadius: '3px', padding: '3px 8px', fontSize: '12px', cursor: 'pointer' }}
                                                >
                                                    Quitar
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <p style={{ fontSize: '13px', color: '#888', fontStyle: 'italic', textAlign: 'center', margin: '15px 0' }}>
                                    No hay jugadores inscritos en este equipo.
                                </p>
                            )}
                        </div>

                        <div style={{ textAlign: 'right' }}>
                            <button
                                onClick={handleCerrarModal}
                                style={{ background: '#007bff', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Guardar y Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* PASO 3: RESUMEN, GENERACIÓN Y REVISIÓN DEL FIXTURE */}
            {paso === 3 && (
                <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3>Resumen del Torneo</h3>
                    <p><b>Nombre:</b> {formTorneo.nombre}</p>
                    <p><b>Fechas:</b> {formTorneo.fechaInicio} al {formTorneo.fechaFin}</p>
                    <p><b>Equipos seleccionados:</b> {totalEquiposInscritos}</p>

                    <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                        {!fixtureGenerado ? (
                            <div style={{ textAlign: 'center', padding: '20px', background: '#f8f9fa', borderRadius: '6px' }}>
                                <p style={{ color: '#555', marginBottom: '15px' }}>
                                    Presione el botón para calcular los emparejamientos y programar el fixture por jornadas.
                                </p>
                                <button
                                    onClick={handleProgramarFixture}
                                    disabled={totalEquiposInscritos < 2}
                                    style={{
                                        background: totalEquiposInscritos < 2 ? '#ccc' : '#007bff',
                                        color: '#fff',
                                        border: 'none',
                                        padding: '12px 25px',
                                        borderRadius: '4px',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        cursor: totalEquiposInscritos < 2 ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    Generar Fixture
                                </button>
                            </div>
                        ) : (
                            <div>
                                <h4 style={{ color: '#28a745', marginBottom: '15px' }}>
                                    Fixture Programado Correctamente (Revisión)
                                </h4>

                                {fixtureGenerado.map((serieFix, sIdx) => (
                                    <div key={sIdx} style={{ marginBottom: '25px', border: '1px solid #17a2b8', borderRadius: '6px', padding: '15px', background: '#fcfcfc' }}>
                                        <h4 style={{ margin: '0 0 10px 0', color: '#17a2b8' }}>
                                            {serieFix.nombreSerie} ({serieFix.jornadas.length} Jornadas)
                                        </h4>

                                        {serieFix.jornadas.length > 0 ? (
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
                                                {serieFix.jornadas.map(jornada => (
                                                    <div key={jornada.numeroJornada} style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '5px', padding: '10px' }}>
                                                        <strong style={{ display: 'block', borderBottom: '1px solid #eee', pb: '5px', mb: '8px', color: '#333' }}>
                                                            Jornada {jornada.numeroJornada}
                                                        </strong>
                                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px' }}>
                                                            {jornada.partidos.map((p, pIdx) => (
                                                                <li key={pIdx} style={{ padding: '4px 0', borderBottom: '1px dashed #f0f0f0' }}>
                                                                    <span>{p.equipoLocal.nombre}</span>
                                                                    <strong style={{ margin: '0 6px', color: '#888' }}>vs</strong>
                                                                    <span>{p.equipoVisitante.nombre}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p style={{ fontSize: '13px', color: '#888' }}>No hay suficientes equipos inscritos en esta serie para estructurar un calendario.</p>
                                        )}
                                    </div>
                                ))}

                                <div style={{ background: '#e2f0d9', border: '1px solid #c3e6cb', padding: '10px 15px', borderRadius: '4px', marginBottom: '20px', fontSize: '13px', color: '#155724' }}>
                                    Verifique los enfrentamientos programados. Si está conforme, presione el botón de abajo para registrar formalmente el torneo.
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                        <button onClick={() => setPaso(2)} style={{ background: '#6c757d', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>
                            &larr; Volver
                        </button>
                        
                        {/* El botón de Registrar Torneo solo se habilita una vez que el fixture ha sido generado */}
                        <button
                            onClick={handleGuardarTorneo}
                            disabled={!fixtureGenerado || loading}
                            style={{
                                background: (!fixtureGenerado || loading) ? '#cccccc' : '#28a745',
                                color: '#fff',
                                border: 'none',
                                padding: '12px 25px',
                                borderRadius: '4px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: (!fixtureGenerado || loading) ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? 'Registrando...' : 'Registrar Torneo'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}