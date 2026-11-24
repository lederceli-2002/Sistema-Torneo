import { API_BASE } from '../Services/api';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    obtenerEquipoPorId, 
    actualizarEquipo, 
    eliminarEquipo, 
    obtenerPlantillaEquipo, 
    agregarJugadorAPlantilla, 
    removerJugadorDePlantilla 
} from '../Services/equipoService';

export default function EditarEquipo() {
    const { idEquipo } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    // 1. Incluimos la propiedad 'escudo' en el estado
    const [formEquipo, setFormEquipo] = useState({ nombre: '', ciudad: '',descripcion:'', escudo: '', estado: 'ACTIVO' });
    const [plantilla, setPlantilla] = useState([]);
    const [jugadoresCatalogo, setJugadoresCatalogo] = useState([]);

    // Estados para el Modal de asignación de jugadores
    const [modalAbierto, setModalAbierto] = useState(false);
    const [idJugadorSeleccionado, setIdJugadorSeleccionado] = useState('');

    // Buscador progresivo en el modal
    const [busquedaJugador, setBusquedaJugador] = useState('');
    const [mostrarDropdown, setMostrarDropdown] = useState(false);

    useEffect(() => {
        async function cargarDatos() {
            try {
                setLoading(true);
                // Cargar datos del equipo (incluyendo el escudo)
                const dataEq = await obtenerEquipoPorId(idEquipo);
                if (dataEq) {
                    setFormEquipo({
                        nombre: dataEq.nombre || '',
                        ciudad: dataEq.ciudad || '',
                        descripcion: dataEq.descripcion || '',
                        escudo: dataEq.escudo || '',
                        estado: dataEq.estado || 'ACTIVO'
                    });
                }

                // Cargar la plantilla base (EQUIPO_JUGADOR)
                const dataPlantilla = await obtenerPlantillaEquipo(idEquipo);
                setPlantilla(Array.isArray(dataPlantilla) ? dataPlantilla : []);

                // Cargar catálogo de todos los jugadores
                const resJugadores = await axios.get(`${API_BASE}/jugadores`);
                setJugadoresCatalogo(Array.isArray(resJugadores.data) ? resJugadores.data : []);
            } catch (error) {
                console.error("Error al cargar los datos del equipo:", error);
            } finally {
                setLoading(false);
            }
        }
        if (idEquipo) cargarDatos();
    }, [idEquipo]);

    const handleChangeEquipo = (e) => {
        const { name, value } = e.target;
        setFormEquipo(prev => ({ ...prev, [name]: value }));
    };

    const handleGuardarEquipo = async (e) => {
        e.preventDefault();
        try {
            await actualizarEquipo(idEquipo, formEquipo);
            alert("¡Información del equipo actualizada correctamente!");
        } catch (error) {
            console.error("Error al actualizar:", error);
            alert("Ocurrió un error al intentar actualizar los datos del equipo.");
        }
    };

    const handleEliminarEquipoCompleto = async () => {
        const confirmacion = window.confirm(
            `¿Está seguro de eliminar definitivamente el equipo "${formEquipo.nombre}"?\nEsta acción eliminará la plantilla base del club.`
        );
        if (!confirmacion) return;

        try {
            await eliminarEquipo(idEquipo);
            alert("El equipo y sus registros en plantilla fueron eliminados correctamente.");
            navigate('/equipos');
        } catch (error) {
            console.error("Error al eliminar el equipo:", error);
            alert("No se pudo eliminar el equipo. Verifique que no esté participando activamente en un torneo.");
        }
    };

    const jugadoresFiltrados = jugadoresCatalogo.filter((j) => {
        if (!busquedaJugador || busquedaJugador.trim() === '') return true;
        const termino = busquedaJugador.toLowerCase().trim();
        const nombreComp = `${j.nombres || j.nombre || ''} ${j.apellidos || j.apellido || ''}`.toLowerCase();
        const dni = (j.dni || '').toString();
        return nombreComp.includes(termino) || dni.includes(termino);
    });

    const handleSeleccionarJugadorModal = (j) => {
        const jId = j.idJugador || j.id_jugador || j.id;
        const nombreComp = `${j.nombres || j.nombre || ''} ${j.apellidos || j.apellido || ''}`.trim();
        setIdJugadorSeleccionado(jId);
        setBusquedaJugador(`${nombreComp} (DNI: ${j.dni || '-'})`);
        setMostrarDropdown(false);
    };

    const handleAgregarJugador = async (e) => {
        e.preventDefault();
        if (!idJugadorSeleccionado) {
            alert("Por favor seleccione un jugador válido de la lista.");
            return;
        }

        try {
            const payload = { idJugador: Number(idJugadorSeleccionado) };
            await agregarJugadorAPlantilla(idEquipo, payload);
            alert("¡Jugador agregado exitosamente a la plantilla!");

            const nuevaPlantilla = await obtenerPlantillaEquipo(idEquipo);
            setPlantilla(Array.isArray(nuevaPlantilla) ? nuevaPlantilla : []);

            setModalAbierto(false);
            setIdJugadorSeleccionado('');
            setBusquedaJugador('');
        } catch (error) {
            console.error("Error al agregar jugador:", error);
            alert("No se pudo agregar el jugador. Es posible que ya pertenezca a este equipo.");
        }
    };

    const handleRemoverJugador = async (jugadorObj) => {
        const idJugadorReal = jugadorObj?.jugador?.idJugador 
            || jugadorObj?.idJugador 
            || jugadorObj?.id_jugador 
            || jugadorObj?.id 
            || (typeof jugadorObj === 'number' ? jugadorObj : null);

        if (!idJugadorReal) {
            alert("No se pudo identificar el ID del jugador a remover.");
            return;
        }

        if (!window.confirm("¿Está seguro de remover a este jugador de la plantilla del equipo?")) return;

        try {
            await removerJugadorDePlantilla(idEquipo, idJugadorReal);
            setPlantilla(prev => prev.filter(item => {
                const idItem = item.jugador?.idJugador || item.idJugador || item.id_jugador || item.id;
                return idItem !== idJugadorReal;
            }));
            alert("Jugador removido de la plantilla exitosamente.");
        } catch (error) {
            console.error("Error al remover jugador:", error);
            alert("Ocurrió un error al remover al jugador de la plantilla.");
        }
    };

    if (loading) return <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>Cargando datos del equipo...</div>;

    return (
        <div style={{ position: 'relative', padding: '30px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            
            {/* CABECERA PRINCIPAL EXISTENTE (Volver y Eliminar Equipo) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <button 
                    onClick={() => navigate('/equipos')} 
                    style={{ background: '#64748b', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    &larr; Volver a Equipos
                </button>
                <button 
                    onClick={handleEliminarEquipoCompleto} 
                    style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    🗑️ Eliminar Equipo
                </button>
            </div>

            {/* FORMULARIO DE DATOS DEL EQUIPO (CON ESCUDO EN ESQUINA DERECHA) */}
            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.08)', marginBottom: '30px', position: 'relative' }}>
                
                {/* PREVISUALIZACIÓN DEL ESCUDO (ESQUINA SUPERIOR DERECHA) */}
                <div style={{ position: 'absolute', top: '20px', right: '20px', textAlign: 'center' }}>
                    {formEquipo.escudo ? (
                        <img 
                            src={formEquipo.escudo} 
                            alt={`Escudo de ${formEquipo.nombre}`} 
                            style={{ 
                                width: '75px', 
                                height: '75px', 
                                objectFit: 'contain', 
                                borderRadius: '8px', 
                                border: '1px solid #e2e8f0',
                                padding: '4px',
                                background: '#f8fafc'
                            }}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                            }}
                        />
                    ) : (
                        <div style={{ 
                            width: '75px', 
                            height: '75px', 
                            borderRadius: '8px', 
                            background: '#f1f5f9', 
                            border: '1px dashed #cbd5e1',
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            fontSize: '28px'
                        }}>
                            🛡️
                        </div>
                    )}
                </div>

                <h3 style={{ margin: '0 0 15px 0', color: '#0f172a' }}>Datos del Equipo</h3>

                <form onSubmit={handleGuardarEquipo} style={{ paddingRight: '95px' }}>
                    
                    {/* FILA 1: Nombre y Ciudad */}
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                        <div style={{ flex: 2 }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Nombre del Equipo *</label>
                            <input 
                                type="text" 
                                name="nombre" 
                                value={formEquipo.nombre} 
                                onChange={handleChangeEquipo} 
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '4px' }} 
                                required 
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Ciudad *</label>
                            <input 
                                type="text" 
                                name="ciudad" 
                                value={formEquipo.ciudad} 
                                onChange={handleChangeEquipo} 
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '4px' }} 
                                required 
                            />
                        </div>
                    </div>

                    {/* FILA 2: URL del Escudo y Estado */}
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                        <div style={{ flex: 2 }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>URL del Escudo (Imagen)</label>
                            <input 
                                type="text" 
                                name="escudo" 
                                value={formEquipo.escudo} 
                                onChange={handleChangeEquipo} 
                                placeholder="https://ejemplo.com/escudo.png"
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '4px' }} 
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Estado</label>
                            <select 
                                name="estado" 
                                value={formEquipo.estado} 
                                onChange={handleChangeEquipo} 
                                style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                            >
                                <option value="ACTIVO">ACTIVO</option>
                                <option value="INACTIVO">INACTIVO</option>
                            </select>
                        </div>
                    </div>

                    {/* FILA 3: Descripción del Equipo */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Descripción (Opcional)</label>
                        <textarea 
                            name="descripcion" 
                            value={formEquipo.descripcion} 
                            onChange={handleChangeEquipo} 
                            rows="3"
                            placeholder="Reseña del club, información institucional o datos del delegado..."
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '4px', fontFamily: 'inherit' }}
                        />
                    </div>

                    <button 
                        type="submit" 
                        style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        💾 Guardar Cambios de Equipo
                    </button>
                </form>
            </div>

            {/* TABLA DE PLANTILLA BASE DE JUGADORES */}
            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ margin: 0, color: '#0f172a' }}>Plantilla Base ({plantilla.length} Jugadores)</h3>
                    <button 
                        onClick={() => {
                            setBusquedaJugador('');
                            setIdJugadorSeleccionado('');
                            setModalAbierto(true);
                        }} 
                        style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '9px 15px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        + Añadir Jugador a Plantilla
                    </button>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                            <th style={{ padding: '10px' }}>DNI</th>
                            <th style={{ padding: '10px' }}>Nombre Completo</th>
                            <th style={{ padding: '10px', textAlign: 'center' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plantilla.length > 0 ? (
                            plantilla.map((item, idx) => {
                                const datosJugador = item.jugador || item;
                                const jId = datosJugador.idJugador || datosJugador.id_jugador || datosJugador.id || idx;
                                const nombreComp = `${datosJugador.nombres || datosJugador.nombre || ''} ${datosJugador.apellidos || datosJugador.apellido || ''}`.trim();
                                const dni = datosJugador.dni || '-';

                                return (
                                    <tr key={jId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '10px', fontWeight: 'bold', color: '#0284c7' }}>#{dni}</td>
                                        <td style={{ padding: '10px' }}>⚽ {nombreComp}</td>
                                        <td style={{ padding: '10px', textAlign: 'center' }}>
                                            <button 
                                                type="button"
                                                onClick={() => handleRemoverJugador(item)} 
                                                style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                                            >
                                                Quitar
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                                    Este equipo aún no posee jugadores asignados en su plantilla base.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL AUTOCOMPLETADO */}
            {modalAbierto && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
                    <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', width: '100%', maxWidth: '450px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                        <h4 style={{ margin: '0 0 15px 0', color: '#0284c7' }}>Añadir Jugador a Plantilla Base</h4>
                        <form onSubmit={handleAgregarJugador}>
                            <div style={{ marginBottom: '15px', position: 'relative' }}>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Buscar Jugador (Nombre o DNI) *</label>
                                <input
                                    type="text"
                                    placeholder="Escriba para buscar en tiempo real..."
                                    value={busquedaJugador}
                                    onChange={(e) => {
                                        setBusquedaJugador(e.target.value);
                                        setIdJugadorSeleccionado('');
                                        setMostrarDropdown(true);
                                    }}
                                    onFocus={() => setMostrarDropdown(true)}
                                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                                    required
                                />

                                {mostrarDropdown && (
                                    <ul style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        right: 0,
                                        maxHeight: '180px',
                                        overflowY: 'auto',
                                        background: '#fff',
                                        border: '1px solid #cbd5e1',
                                        borderRadius: '0 0 6px 6px',
                                        listStyle: 'none',
                                        margin: 0,
                                        padding: 0,
                                        zIndex: 3000,
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                    }}>
                                        {jugadoresFiltrados.length > 0 ? (
                                            jugadoresFiltrados.map((j) => {
                                                const jId = j.idJugador || j.id_jugador || j.id;
                                                const nombreComp = `${j.nombres || j.nombre || ''} ${j.apellidos || j.apellido || ''}`.trim();
                                                return (
                                                    <li
                                                        key={jId}
                                                        onClick={() => handleSeleccionarJugadorModal(j)}
                                                        style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}
                                                        onMouseDown={(e) => e.preventDefault()}
                                                    >
                                                        ⚽ <strong>{nombreComp}</strong> - <span style={{ color: '#64748b' }}>DNI: {j.dni || '-'}</span>
                                                    </li>
                                                );
                                            })
                                        ) : (
                                            <li style={{ padding: '10px', color: '#94a3b8', textAlign: 'center' }}>
                                                No se encontraron coincidencias
                                            </li>
                                        )}
                                    </ul>
                                )}
                            </div>

                            <div style={{ textAlign: 'right', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button 
                                    type="button" 
                                    onClick={() => setModalAbierto(false)} 
                                    style={{ background: '#64748b', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                    Guardar en Plantilla
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}