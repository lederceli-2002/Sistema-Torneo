import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    registrarTorneoCompleto, 
    obtenerEquiposDisponibles, 
    obtenerPlantillaBaseEquipo 
} from '../Services/registroTorneoService';

export default function CrearTorneo() {
    const navigate = useNavigate();
    const [paso, setPaso] = useState(1);
    const [loading, setLoading] = useState(false);
    
    // Lista base de equipos obtenida del Backend
    const [equiposBase, setEquiposBase] = useState([]);

    // Estado para controlar el texto del buscador de equipos en las series
    const [textoBusquedaEquipo, setTextoBusquedaEquipo] = useState({});

    // Estado para el MODAL de selección de convocados (Plantilla Atemporal)
    const [modalAbierto, setModalAbierto] = useState(false);
    const [equipoSeleccionadoModal, setEquipoSeleccionadoModal] = useState(null); // { sIdx, eqIdx, equipo }
    const [plantillaBaseModal, setPlantillaBaseModal] = useState([]); // Lista atemporal de EQUIPO_JUGADOR
    const [cargandoPlantilla, setCargandoPlantilla] = useState(false);

    // Estado para almacenar la previsualización del Fixture Generado antes de guardar
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
            const dataEquipos = await obtenerEquiposDisponibles();
            if (Array.isArray(dataEquipos)) {
                setEquiposBase(dataEquipos);
            }
        }
        cargarDatos();
    }, []);

    const handleChangeDatos = (e) => {
        const { name, value } = e.target;
        
        setFormTorneo(prev => {
            const nuevoEstado = { ...prev, [name]: value };
            
            // Si el usuario cambia la cantidad de series en el Paso 1, regeneramos las series dinámicamente
            if (name === 'cantidadSeries') {
                const numSeries = Math.max(1, parseInt(value) || 1);
                const nuevasSeries = [];
                for (let i = 0; i < numSeries; i++) {
                    const letra = String.fromCharCode(65 + i); // A, B, C, D...
                    const serieExistente = prev.series[i];
                    nuevasSeries.push({
                        nombre: `Serie ${letra}`,
                        equipos: serieExistente ? serieExistente.equipos : []
                    });
                }
                nuevoEstado.series = nuevasSeries;
            }
            
            return nuevoEstado;
        });
        setFixtureGenerado(null);
    };

    // --- AGREGAR EQUIPO A LA SERIE ---
    const handleAgregarEquipoASerie = async (sIdx) => {
        const nombreIngresado = textoBusquedaEquipo[sIdx];
        if (!nombreIngresado) return;

        const equipoObj = equiposBase.find(eq => eq.nombre.trim().toLowerCase() === nombreIngresado.trim().toLowerCase());
        if (!equipoObj) {
            alert("Seleccione un equipo válido de la lista desplegable.");
            return;
        }

        const eqId = equipoObj.idEquipo || equipoObj.id_equipo || equipoObj.id;

        // Cargar plantilla atemporal desde EQUIPO_JUGADOR
        const plantillaBase = await obtenerPlantillaBaseEquipo(eqId);

        setFormTorneo(prev => {
            const nuevasSeries = prev.series.map((s, idx) => {
                if (idx !== sIdx) return s;
                const yaExiste = s.equipos.some(e => (e.idEquipo || e.id_equipo || e.id) === eqId);
                if (yaExiste) {
                    alert("Este equipo ya se encuentra asignado a esta serie.");
                    return s;
                }
                return {
                    ...s,
                    equipos: [
                        ...s.equipos,
                        {
                            ...equipoObj,
                            // Por defecto se cargan todos convocados
                            jugadoresInscritos: [...plantillaBase] 
                        }
                    ]
                };
            });
            return { ...prev, series: nuevasSeries };
        });

        setFixtureGenerado(null);
        setTextoBusquedaEquipo(prev => ({ ...prev, [sIdx]: '' }));
    };

    const handleRemoverEquipoDeSerie = (indexSerie, idEquipo) => {
        setFormTorneo(prev => {
            const nuevasSeries = prev.series.map((s, sIdx) => {
                if (sIdx !== indexSerie) return s;
                return {
                    ...s,
                    equipos: s.equipos.filter(e => (e.idEquipo || e.id_equipo || e.id) !== idEquipo)
                };
            });
            return { ...prev, series: nuevasSeries };
        });
        setFixtureGenerado(null);
    };

    // --- MODAL DE CONVOCATORIA (ABRIR / CERRA) ---
    const handleAbrirModalJugadores = async (sIdx, eqIdx) => {
        const equipo = formTorneo.series[sIdx].equipos[eqIdx];
        const eqId = equipo.idEquipo || equipo.id_equipo || equipo.id;

        setCargandoPlantilla(true);
        setModalAbierto(true);
        setEquipoSeleccionadoModal({ sIdx, eqIdx, idEquipo: eqId, nombreEquipo: equipo.nombre });

        const plantilla = await obtenerPlantillaBaseEquipo(eqId);
        setPlantillaBaseModal(plantilla);
        setCargandoPlantilla(false);
    };

    const handleCerrarModal = () => {
        setModalAbierto(false);
        setEquipoSeleccionadoModal(null);
    };

   // HELPER para extraer siempre el ID numérico real (venga anidado o plano)
const extraerIdJugador = (obj) => {
    const real = obj?.jugador || obj;
    return Number(real?.idJugador || real?.id_jugador || real?.id || 0);
};

// Función exacta que usa tus variables: equipoSeleccionadoModal y formTorneo
const handleToggleConvocado = (jugadorObj) => {
    if (!equipoSeleccionadoModal) return;

    const jId = extraerIdJugador(jugadorObj);
    if (!jId) return;

    const { sIdx, eqIdx } = equipoSeleccionadoModal;

    setFormTorneo((prev) => {
        const nuevasSeries = prev.series.map((serie, idxS) => {
            if (idxS !== sIdx) return serie;
            return {
                ...serie,
                equipos: serie.equipos.map((eq, idxE) => {
                    if (idxE !== eqIdx) return eq;

                    const actuales = eq.jugadoresInscritos || [];
                    const yaEstaInscrito = actuales.some((j) => extraerIdJugador(j) === jId);

                    const nuevosConvocados = yaEstaInscrito
                        ? actuales.filter((j) => extraerIdJugador(j) !== jId) // DESMARCAR
                        : [...actuales, { idJugador: jId }]; // MARCAR

                    return { ...eq, jugadoresInscritos: nuevosConvocados };
                }),
            };
        });
        return { ...prev, series: nuevasSeries };
    });
};

   
    // --- ALGORITMO DE GENERACIÓN DE FIXTURE (ROUND-ROBIN) ---
    const handleGenerarPrevisualizacionFixture = () => {
        const seriesCalculadas = formTorneo.series.map(serie => {
            const equiposSerie = [...serie.equipos];
            if (equiposSerie.length < 2) {
                return { nombreSerie: serie.nombre, equipos: equiposSerie, jornadas: [] };
            }

            let lista = [...equiposSerie];
            if (lista.length % 2 !== 0) {
                lista.push({ idEquipo: -1, nombre: 'DESCANSA' });
            }

            const numEquipos = lista.length;
            const numJornadas = numEquipos - 1;
            const partidosPorJornada = numEquipos / 2;
            const jornadas = [];

            for (let j = 0; j < numJornadas; j++) {
                const partidos = [];
                for (let i = 0; i < partidosPorJornada; i++) {
                    const local = lista[i];
                    const visitante = lista[numEquipos - 1 - i];

                    if (local.idEquipo !== -1 && visitante.idEquipo !== -1) {
                        partidos.push({ local, visitante });
                    }
                }
                jornadas.push({ numeroJornada: j + 1, partidos });
                lista.splice(1, 0, lista.pop());
            }

            return {
                nombreSerie: serie.nombre,
                equipos: serie.equipos,
                jornadas: jornadas
            };
        });

        setFixtureGenerado(seriesCalculadas);
    };

    // --- ENVIAR AL BACKEND AL ESTAR SATISFECHO CON EL FIXTURE ---
    const handleGuardarTorneo = async (e) => {
        if (e) e.preventDefault();

        if (!formTorneo.nombre || !formTorneo.fechaInicio || !formTorneo.fechaFin) {
            alert("Por favor completa los campos obligatorios del torneo.");
            return;
        }

        if (!fixtureGenerado || fixtureGenerado.length === 0) {
            alert("Por favor genera y revisa la vista previa del fixture antes de registrar.");
            return;
        }

        try {
            setLoading(true);
            await registrarTorneoCompleto(formTorneo, fixtureGenerado);
            alert("¡Torneo y fixture oficial registrados exitosamente!");
            navigate('/');
        } catch (error) {
            console.error("Error al registrar el torneo:", error);
            const mensajeError = error.response?.data?.message || error.response?.data || "Error al procesar el registro.";
            alert(`No se pudo registrar el torneo: ${mensajeError}`);
        } finally {
            setLoading(false);
        }
    };

    const totalEquiposInscritos = formTorneo.series.reduce((acc, s) => acc + s.equipos.length, 0);

    return (
        <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            <h2>Crear Nuevo Torneo</h2>

            {/* Stepper de Pasos */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', borderBottom: '1px solid #ddd', paddingBottom: '15px' }}>
                <span style={{ fontWeight: paso === 1 ? 'bold' : 'normal', color: paso === 1 ? '#0284c7' : '#64748b' }}>1. Datos Generales</span>
                <span style={{ fontWeight: paso === 2 ? 'bold' : 'normal', color: paso === 2 ? '#0284c7' : '#64748b' }}>2. Series y Convocados</span>
                <span style={{ fontWeight: paso === 3 ? 'bold' : 'normal', color: paso === 3 ? '#0284c7' : '#64748b' }}>3. Vista Previa Fixture & Confirmar</span>
            </div>

            {/* PASO 1 */}
            {paso === 1 && (
                <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Nombre del Torneo *</label>
                        <input type="text" name="nombre" value={formTorneo.nombre} onChange={handleChangeDatos} placeholder="Ej: Campeonato Clausura 2026" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} required />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Descripción (opcional)</label>
                        <input type="text" name="descripcion" value={formTorneo.descripcion} onChange={handleChangeDatos} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Fecha de Inicio *</label>
                            <input type="date" name="fechaInicio" value={formTorneo.fechaInicio} onChange={handleChangeDatos} style={{ width: '100%', padding: '8px' }} required />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Fecha de Fin *</label>
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
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Cantidad de Series *</label>
                            <input 
                                type="number" 
                                name="cantidadSeries" 
                                value={formTorneo.cantidadSeries} 
                                onChange={handleChangeDatos} 
                                min="1" 
                                max="10"
                                style={{ width: '100%', padding: '8px' }} 
                            />
                        </div>
                    </div>

                    <button onClick={() => setPaso(2)} disabled={!formTorneo.nombre || !formTorneo.fechaInicio} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Siguiente &rarr;
                    </button>
                </div>
            )}

            {/* PASO 2: ASIGNACIÓN Y CONVOCATORIAS */}
            {paso === 2 && (
                <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
                    <h3>Asignación de Equipos a Series ({formTorneo.series.length} series)</h3>

                    <datalist id="lista-equipos-disponibles">
                        {equiposBase.map((eq) => {
                            const eqId = eq.idEquipo || eq.id_equipo || eq.id;
                            return <option key={eqId} value={eq.nombre} />;
                        })}
                    </datalist>

                    {formTorneo.series.map((serie, sIdx) => (
                        <div key={sIdx} style={{ border: '1px solid #e2e8f0', padding: '15px', borderRadius: '6px', marginBottom: '20px', background: '#f8fafc' }}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>{serie.nombre}</h4>

                            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                                <input
                                    type="text"
                                    list="lista-equipos-disponibles"
                                    placeholder="Haga clic para ver los equipos creados..."
                                    value={textoBusquedaEquipo[sIdx] || ''}
                                    onChange={(e) => setTextoBusquedaEquipo({ ...textoBusquedaEquipo, [sIdx]: e.target.value })}
                                    style={{ flex: 1, padding: '8px' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleAgregarEquipoASerie(sIdx)}
                                    style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    + Añadir Equipo
                                </button>
                            </div>

                            {/* Tarjetas de Equipos */}
                            {serie.equipos.map((eq, eqIdx) => {
                                const eqId = eq.idEquipo || eq.id_equipo || eq.id;
                                const cantConvocados = eq.jugadoresInscritos ? eq.jugadoresInscritos.length : 0;
                                return (
                                    <div key={eqId} style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '5px', padding: '10px 15px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <strong style={{ fontSize: '15px', color: '#0f172a' }}>{eq.nombre}</strong>
                                            <span style={{ marginLeft: '12px', fontSize: '12px', color: '#0284c7', background: '#e0f2fe', padding: '3px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                                                {cantConvocados} convocados para el torneo
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                type="button"
                                                onClick={() => handleAbrirModalJugadores(sIdx, eqIdx)}
                                                style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 12px', fontSize: '13px', cursor: 'pointer' }}
                                            >
                                                👥 Seleccionar Convocados
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoverEquipoDeSerie(sIdx, eqId)}
                                                style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 12px', fontSize: '13px', cursor: 'pointer' }}
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
                        <button onClick={() => setPaso(1)} style={{ background: '#64748b', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>
                            &larr; Volver
                        </button>
                        <button onClick={() => setPaso(3)} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                            Siguiente &rarr;
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL CHECKLIST JUGADORES */}
            {modalAbierto && equipoSeleccionadoModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
                    <div style={{ background: '#fff', borderRadius: '8px', padding: '25px', width: '100%', maxWidth: '500px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '15px' }}>
                            <h3 style={{ margin: 0, color: '#0284c7' }}>
                                Plantilla Base de {equipoSeleccionadoModal.equipo?.nombre || equipoSeleccionadoModal.nombreEquipo}
                            </h3>
                            <button onClick={handleCerrarModal} style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>&times;</button>
                        </div>

                        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 10px 0' }}>
                            Marque los jugadores de la plantilla institucional que participarán oficialmente en este torneo:
                        </p>

                        <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px' }}>
                            {cargandoPlantilla ? (
                                <p style={{ textAlign: 'center', color: '#64748b' }}>Cargando plantilla base...</p>
                            ) : plantillaBaseModal.length > 0 ? (
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {plantillaBaseModal.map((item, idx) => {
                                        const datos = item.jugador || item;
                                        const jId = extraerIdJugador(item);

                                        // Lee en vivo desde formTorneo usando tus índices equipoSeleccionadoModal.sIdx y eqIdx
                                        const equipoActual = formTorneo.series[equipoSeleccionadoModal.sIdx]?.equipos[equipoSeleccionadoModal.eqIdx];
                                        const convocadosActuales = equipoActual?.jugadoresInscritos || [];
                                        const estaConvocado = convocadosActuales.some((j) => extraerIdJugador(j) === jId);

                                        const nombreComp = `${datos.nombres || datos.nombre || ''} ${datos.apellidos || datos.apellido || ''}`.trim() || `Jugador #${jId}`;

                                        return (
                                            <li
                                                key={jId || idx}
                                                onClick={() => handleToggleConvocado(item)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    padding: '10px',
                                                    borderBottom: '1px solid #f1f5f9',
                                                    cursor: 'pointer',
                                                    backgroundColor: estaConvocado ? '#f0fdf4' : '#ffffff'
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={estaConvocado}
                                                    onChange={() => {}}
                                                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                                />
                                                <span style={{ fontSize: '14px', color: '#1e293b' }}>
                                                    ⚽ <strong>{nombreComp}</strong>{' '}
                                                    <span style={{ color: '#64748b', fontSize: '12px' }}>(DNI: {datos.dni || '-'})</span>
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <p style={{ fontSize: '13px', color: '#ef4444', textAlign: 'center', margin: '15px 0' }}>
                                    Este equipo no posee una plantilla base registrada en el módulo de Equipos.
                                </p>
                            )}
                        </div>

                        <div style={{ textAlign: 'right', marginTop: '15px' }}>
                            <button
                                onClick={handleCerrarModal}
                                style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Confirmar Convocados
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* PASO 3: INSPECCIÓN DE VISTA PREVIA Y CONFIRMACIÓN */}
            {paso === 3 && (
                <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
                    <h3 style={{ marginTop: 0, color: '#1e293b' }}>Resumen & Vista Previa del Fixture</h3>
                    <p><b>Nombre:</b> {formTorneo.nombre}</p>
                    <p><b>Fechas:</b> {formTorneo.fechaInicio} al {formTorneo.fechaFin}</p>
                    <p><b>Equipos Totales Inscritos:</b> {totalEquiposInscritos}</p>

                    {!fixtureGenerado ? (
                        <div style={{ padding: '20px', background: '#f0f9ff', borderRadius: '6px', border: '1px solid #bae6fd', textAlign: 'center', margin: '20px 0' }}>
                            <p style={{ margin: '0 0 12px 0', color: '#0369a1', fontWeight: 'bold' }}>
                                Presione el botón para calcular los enfrentamientos por jornadas antes de guardar:
                            </p>
                            <button
                                type="button"
                                onClick={handleGenerarPrevisualizacionFixture}
                                style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                ⚙ Generar Vista Previa del Fixture
                            </button>
                        </div>
                    ) : (
                        <div style={{ marginTop: '20px', borderTop: '2px dashed #cbd5e1', paddingTop: '15px' }}>
                            <h4 style={{ color: '#16a34a', margin: '0 0 15px 0' }}>✓ Fixture Generado para Inspección</h4>
                            
                            {fixtureGenerado.map((serie, sIdx) => (
                                <div key={sIdx} style={{ marginBottom: '20px', background: '#f8fafc', padding: '15px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                    <h4 style={{ margin: '0 0 10px 0', color: '#0284c7' }}>{serie.nombreSerie}</h4>
                                    
                                    {serie.jornadas && serie.jornadas.length > 0 ? (
                                        serie.jornadas.map((jornada, jIdx) => (
                                            <div key={jIdx} style={{ marginBottom: '10px', background: '#fff', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                                                <strong style={{ fontSize: '13px', color: '#334155', display: 'block', marginBottom: '5px' }}>
                                                    Jornada {jornada.numeroJornada}:
                                                </strong>
                                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px' }}>
                                                    {jornada.partidos.map((p, pIdx) => (
                                                        <li key={pIdx} style={{ padding: '3px 0', color: '#1e293b' }}>
                                                            ⚽ <b>{p.local.nombre}</b> vs <b>{p.visitante.nombre}</b>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))
                                    ) : (
                                        <p style={{ fontStyle: 'italic', fontSize: '12px', color: '#64748b' }}>Se necesitan al menos 2 equipos en esta serie para estructurar los cruces.</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                        <button onClick={() => setPaso(2)} style={{ background: '#64748b', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>
                            &larr; Volver
                        </button>
                        <button
                            onClick={handleGuardarTorneo}
                            disabled={loading || !fixtureGenerado}
                            style={{
                                background: (!fixtureGenerado || loading) ? '#94a3b8' : '#16a34a',
                                color: '#fff',
                                border: 'none',
                                padding: '12px 25px',
                                borderRadius: '4px',
                                fontSize: '15px',
                                fontWeight: 'bold',
                                cursor: (!fixtureGenerado || loading) ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? 'Procesando...' : '💾 Confirmar y Registrar Torneo'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}