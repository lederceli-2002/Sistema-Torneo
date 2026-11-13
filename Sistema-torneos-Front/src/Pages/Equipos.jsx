import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarEquipos } from '../Services/equipoService';

// Componente defensivo para renderizar el Escudo o el Avatar por defecto
function EscudoEquipo({ equipo }) {
    const urlEscudo = equipo?.escudo || equipo?.urlEscudo || equipo?.url_escudo || '';
    const nombreEquipo = equipo?.nombre || 'Equipo';
    const inicial = nombreEquipo.charAt(0).toUpperCase();

    const [errorImagen, setErrorImagen] = useState(false);

    // Si no hay URL o si la imagen falla al cargar, muestra el fallback circular con la inicial
    if (!urlEscudo || errorImagen) {
        return (
            <span style={{ 
                background: '#e2e8f0', 
                color: '#1e293b', 
                fontWeight: 'bold', 
                borderRadius: '50%', 
                padding: '6px 11px',
                display: 'inline-block',
                fontSize: '14px',
                border: '1px solid #cbd5e1'
            }}>
                {inicial}
            </span>
        );
    }

    return (
        <img 
            src={urlEscudo} 
            alt={`Escudo de ${nombreEquipo}`} 
            style={{ 
                width: '32px', 
                height: '32px', 
                objectFit: 'contain', 
                borderRadius: '50%',
                border: '1px solid #e2e8f0',
                background: '#fff',
                padding: '2px',
                verticalAlign: 'middle'
            }}
            onError={() => setErrorImagen(true)}
        />
    );
}

export default function Equipos() {
    const navigate = useNavigate();
    const [equipos, setEquipos] = useState([]);
    const [filtro, setFiltro] = useState('');

    useEffect(() => {
        async function cargar() {
            const data = await listarEquipos();
            if (Array.isArray(data)) setEquipos(data);
        }
        cargar();
    }, []);

    const equiposFiltrados = equipos.filter(eq => 
        eq.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
        eq.ciudad?.toLowerCase().includes(filtro.toLowerCase())
    );

    return (
        <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h2 style={{ margin: 0, color: '#0f172a' }}>Equipos</h2>
                    <p style={{ margin: '5px 0 0 0', color: '#64748b' }}>Registro y mantenimiento de los equipos.</p>
                </div>
                <button 
                    onClick={() => navigate('/equipos/crear')} 
                    style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    + Nuevo equipo
                </button>
            </div>

            <input 
                type="text" 
                placeholder="Buscar por nombre o ciudad..." 
                value={filtro} 
                onChange={(e) => setFiltro(e.target.value)} 
                style={{ padding: '9px 12px', width: '320px', marginBottom: '20px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
            />

            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#334155' }}>
                        <th style={{ padding: '12px' }}>Escudo</th>
                        <th style={{ padding: '12px' }}>Nombre</th>
                        <th style={{ padding: '12px' }}>Ciudad</th>
                        <th style={{ padding: '12px' }}>Estado</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {equiposFiltrados.map((eq) => {
                        const eqId = eq.idEquipo || eq.id_equipo || eq.id;
                        return (
                            <tr key={eqId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '12px' }}>
                                    {/* Renderizado dinámico del Escudo */}
                                    <EscudoEquipo equipo={eq} />
                                </td>
                                <td style={{ padding: '12px', fontWeight: 'bold', color: '#0f172a' }}>{eq.nombre}</td>
                                <td style={{ padding: '12px', color: '#64748b' }}>{eq.ciudad || 'Lima'}</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                                        {eq.estado || 'Activo'}
                                    </span>
                                </td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>
                                    <button 
                                        onClick={() => navigate(`/equipos/editar/${eqId}`)} 
                                        style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                                    >
                                        Datos de equipo
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}