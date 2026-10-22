import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ModalTarjetasJornada.css';

const ModalTarjetasJornada = ({ isOpen, onClose, idJornada, serieNombre, numeroJornada }) => {
  const [tarjetas, setTarjetas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && idJornada) {
      const cargarTarjetas = async () => {
        setLoading(true);
        try {
          const res = await axios.get(`http://localhost:8080/api/tarjetas/jornada/${idJornada}`);
          setTarjetas(res.data || []);
        } catch (error) {
          console.error("Error al cargar tarjetas de la jornada:", error);
          setTarjetas([]);
        } finally {
          setLoading(false);
        }
      };
      cargarTarjetas();
    }
  }, [isOpen, idJornada]);

  if (!isOpen) return null;

  // Agrupar tarjetas por Partido/Enfrentamiento
  const tarjetasPorPartido = tarjetas.reduce((acc, t) => {
    const key = t.partido || "Enfrentamiento";
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});

  return (
    <div className="modal-tarjetas-overlay">
      <div className="modal-tarjetas-container">
        <div className="modal-tarjetas-header">
          <h2> Tarjetero Disciplinario</h2>
          <p>{serieNombre || 'Serie A'} - Jornada {numeroJornada || 1}</p>
          <button className="btn-close-modal" onClick={onClose}>✕</button>
        </div>

        <div className="modal-tarjetas-body">
          {loading ? (
            <p className="loading-text">Cargando reporte de sanciones...</p>
          ) : Object.keys(tarjetasPorPartido).length === 0 ? (
            <div className="no-tarjetas-box">
              <p>🟢 No se registraron tarjetas disciplinarias en esta jornada.</p>
            </div>
          ) : (
            Object.entries(tarjetasPorPartido).map(([partido, lista]) => (
              <div key={partido} className="partido-tarjetas-card">
                <h3 className="partido-title"> {partido}</h3>
                <div className="tarjetas-lista">
                  {lista.map((t, index) => (
                    <div key={t.idTarjeta || index} className="tarjeta-item">
                      <span className="tarjeta-badge">
                        {t.tipo?.toLowerCase().includes("roja") ? "🟥" : "🟨"}
                      </span>
                      <span className="minuto-text">{t.minuto}'</span>
                      <span className="jugador-nombre">{t.jugador}</span>
                      <span className="equipo-nombre">({t.equipo})</span>
                      <span className="tipo-text">- Tarjeta {t.tipo}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="modal-tarjetas-footer">
          <button className="btn-cerrar" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalTarjetasJornada;