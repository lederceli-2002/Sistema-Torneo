import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrarEquipoConPlantilla} from '../Services/equipoService';
import { listarJugadores } from '../Services/jugadorService';

export default function CrearEquipo() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Lista maestra de todos los jugadores obtenida del Backend
    const [jugadoresMaestros, setJugadoresMaestros] = useState([]);

    // Estado para el texto del input buscador de jugadores
    const [textoBusquedaJugador, setTextoBusquedaJugador] = useState('');

    // Estado principal del formulario de Creación de Equipo
    const [formEquipo, setFormEquipo] = useState({
        nombre: '',
        descripcion: '',
        ciudad: '',
        escudo: '',
        estado: 'ACTIVO' // Asignado por defecto a "ACTIVO"
    });

    // Lista de jugadores seleccionados para conformar la plantilla base del club
    const [plantillaSeleccionada, setPlantillaSeleccionada] = useState([]);

    // Cargar la lista maestra de jugadores al montar el componente
    useEffect(() => {
        async function cargarJugadores() {
            const data = await listarJugadores();
            if (Array.isArray(data)) {
                setJugadoresMaestros(data);
            }
        }
        cargarJugadores();
    }, []);

    // Manejo de inputs del formulario base del equipo
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormEquipo(prev => ({ ...prev, [name]: value }));
    };

    // --- MANEJO DEL AUTOCOMPLETADO DE JUGADORES ---
    const handleAgregarJugadorAPlantilla = () => {
        if (!textoBusquedaJugador.trim()) return;

        // Buscar coincidencia exacta por Nombres + Apellidos o Nombres
        const jugadorEncontrado = jugadoresMaestros.find(j => {
            const nombreCompleto = `${j.nombres || ''} ${j.apellidos || ''}`.trim().toLowerCase();
            return nombreCompleto === textoBusquedaJugador.trim().toLowerCase() ||
                   j.nombres?.trim().toLowerCase() === textoBusquedaJugador.trim().toLowerCase();
        });

        if (!jugadorEncontrado) {
            alert("Por favor seleccione un jugador válido de la lista desplegable.");
            return;
        }

        const idReal = jugadorEncontrado.idJugador || jugadorEncontrado.id_jugador || jugadorEncontrado.id;

        // Evitar duplicados en la plantilla local
        const yaExiste = plantillaSeleccionada.some(j => (j.idJugador || j.id_jugador || j.id) === idReal);
        if (yaExiste) {
            alert("Este jugador ya se encuentra agregado a la plantilla del equipo.");
            return;
        }

        setPlantillaSeleccionada(prev => [...prev, jugadorEncontrado]);
        setTextoBusquedaJugador(''); // Limpiar el input tras agregar
    };

    const handleRemoverJugador = (idJugador) => {
        setPlantillaSeleccionada(prev => 
            prev.filter(j => (j.idJugador || j.id_jugador || j.id) !== idJugador)
        );
    };

    // --- ENVÍO AL BACKEND ---
    const handleSubmitGuardar = async (e) => {
    e.preventDefault();

    const payload = {
        nombre: formEquipo.nombre,
        ciudad: formEquipo.ciudad,
        escudo: formEquipo.escudo,
        descripcion: formEquipo.descripcion,
        estado: formEquipo.estado,
        idsJugadores: plantillaSeleccionada.map(j => j.idJugador || j.id) // Lista de IDs de jugadores
    };

    try {
        await registrarEquipoConPlantilla(payload);
        alert("¡Equipo registrado con su plantilla exitosamente!");
        navigate("/equipos");
    } catch (error) {
        console.error("Error al guardar equipo:", error);
        alert("Ocurrió un error al guardar el equipo.");
    }
};

    return (
        <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ color: '#1e293b', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
                Crear Nuevo Equipo
            </h2>

            <form onSubmit={handleSubmitGuardar} style={{ background: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                
                {/* SECCIÓN 1: DATOS MAESTROS DEL EQUIPO */}
                <h3 style={{ fontSize: '16px', color: '#0284c7', marginTop: 0, marginBottom: '15px' }}>
                    1. Datos de la Institución / Club
                </h3>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Nombre del Equipo *</label>
                    <input
                        type="text"
                        name="nombre"
                        value={formEquipo.nombre}
                        onChange={handleChange}
                        placeholder="Ej: Deportivo Municipal de San Luis"
                        style={{ width: '100%', padding: '9px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                        required
                    />
                </div>

                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Ciudad / Origen *</label>
                        <input
                            type="text"
                            name="ciudad"
                            value={formEquipo.ciudad}
                            onChange={handleChange}
                            placeholder="Ej: Lima / El Agustino"
                            style={{ width: '100%', padding: '9px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                            required
                        />
                    </div>

                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Estado Inicial</label>
                        <select
                            name="estado"
                            value={formEquipo.estado}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '9px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#f8fafc' }}
                        >
                            <option value="ACTIVO">ACTIVO</option>
                            <option value="INACTIVO">INACTIVO</option>
                        </select>
                    </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>URL del Escudo (Opcional)</label>
                    <input
                        type="text"
                        name="escudo"
                        value={formEquipo.escudo}
                        onChange={handleChange}
                        placeholder="https://link-de-imagen.com/escudo.png"
                        style={{ width: '100%', padding: '9px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Descripción (Opcional)</label>
                    <textarea
                        name="descripcion"
                        value={formEquipo.descripcion}
                        onChange={handleChange}
                        rows="2"
                        placeholder="Breve reseña del club o delegado..."
                        style={{ width: '100%', padding: '9px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '20px 0' }} />

                {/* SECCIÓN 2: PLANTILLA BASE (EQUIPO_JUGADOR) */}
                <h3 style={{ fontSize: '16px', color: '#0284c7', marginBottom: '15px' }}>
                    2. Plantilla Base de Jugadores (Asignación Atemporal)
                </h3>

                {/* Datalist maestro de autocompletado */}
                <datalist id="lista-jugadores-maestros">
                    {jugadoresMaestros.map((j) => {
                        const jId = j.idJugador || j.id_jugador || j.id;
                        const nombreMostrar = `${j.nombres || ''} ${j.apellidos || ''}`.trim() || j.nombre;
                        return (
                            <option key={jId} value={nombreMostrar}>
                                {j.dni ? `DNI: ${j.dni}` : ''}
                            </option>
                        );
                    })}
                </datalist>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <input
                        type="text"
                        list="lista-jugadores-maestros"
                        placeholder="Haga clic para ver todos los jugadores o escriba para buscar..."
                        value={textoBusquedaJugador}
                        onChange={(e) => setTextoBusquedaJugador(e.target.value)}
                        style={{ flex: 1, padding: '9px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <button
                        type="button"
                        onClick={handleAgregarJugadorAPlantilla}
                        style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        + Agregar a Plantilla
                    </button>
                </div>

                {/* Lista de Jugadores agregados */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '15px', background: '#f8fafc', marginBottom: '25px' }}>
                    <strong style={{ fontSize: '14px', color: '#334155', display: 'block', marginBottom: '10px' }}>
                        Jugadores de la Plantilla Base ({plantillaSeleccionada.length}):
                    </strong>

                    {plantillaSeleccionada.length > 0 ? (
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {plantillaSeleccionada.map(j => {
                                const jId = j.idJugador || j.id_jugador || j.id;
                                const nombreCompleto = `${j.nombres || ''} ${j.apellidos || ''}`.trim() || j.nombre;
                                return (
                                    <li key={jId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', marginBottom: '6px' }}>
                                        <span style={{ fontSize: '14px', color: '#1e293b' }}>
                                            ⚽ <b>{nombreCompleto}</b> {j.dni ? <small style={{ color: '#64748b' }}>(DNI: {j.dni})</small> : ''}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoverJugador(jId)}
                                            style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '3px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer' }}
                                        >
                                            Quitar
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', margin: '10px 0' }}>
                            Aún no ha agregado jugadores a la plantilla base de este club.
                        </p>
                    )}
                </div>

                {/* BOTONES DE ACCIÓN */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <button
                        type="button"
                        onClick={() => navigate('/equipos')}
                        style={{ background: '#64748b', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ background: loading ? '#93c5fd' : '#16a34a', color: '#fff', border: 'none', padding: '10px 25px', borderRadius: '4px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '15px' }}
                    >
                        {loading ? 'Guardando...' : ' Registrar Equipo'}
                    </button>
                </div>

            </form>
        </div>
    );
}