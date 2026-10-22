import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TablaPosicionesJornada.css'; // Asegúrate de tener los estilos vinculados

const TablaPosicionesJornada = ({ idJornada }) => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const obtenerRanking = async () => {
      if (!idJornada) return;
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8080/api/ranking/jornada/${idJornada}`);
        console.log("Datos del Ranking recibidos del Backend:", res.data);
        setRanking(res.data || []);
      } catch (error) {
        console.error("Error al obtener la tabla de posiciones:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerRanking();
  }, [idJornada]);

  if (loading) {
    return <div className="text-center my-3 text-muted">Cargando tabla de posiciones...</div>;
  }

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-header bg-dark text-white fw-bold d-flex justify-content-between align-items-center">
        <span> Tabla de Posiciones - Jornada</span>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-striped table-hover mb-0 text-center align-middle">
            <thead className="table-dark">
              <tr>
                <th>Pos</th>
                <th className="text-start">Equipo</th>
                <th>PJ</th>
                <th>PG</th>
                <th>PE</th>
                <th>PP</th>
                <th>GF</th>
                <th>GC</th>
                <th>DG</th>
                <th>PTS</th>
              </tr>
            </thead>
            <tbody>
              {ranking && ranking.length > 0 ? (
                ranking.map((item, index) => {
                  // Mapeo seguro del nombre del equipo
                  const nombreEquipo =
                    item.participacionEquipoTorneo?.equipo?.nombre ||
                    item.nombreEquipo ||
                    `Equipo ${index + 1}`;

                  return (
                    <tr key={item.idRankingJornada || index}>
                      <td className="fw-bold">{item.posicion || index + 1}</td>
                      <td className="text-start fw-bold text-primary">{nombreEquipo}</td>
                      <td>{item.partidosJugados ?? 0}</td>
                      <td>{item.ganados ?? 0}</td>
                      <td>{item.empatados ?? 0}</td>
                      <td>{item.perdidos ?? 0}</td>
                      <td>{item.golesFavor ?? 0}</td>
                      <td>{item.golesContra ?? 0}</td>
                      <td className={`fw-bold ${(item.diferenciaGoles || 0) > 0 ? 'text-success' : (item.diferenciaGoles || 0) < 0 ? 'text-danger' : ''}`}>
                        {(item.diferenciaGoles || 0) > 0 ? `+${item.diferenciaGoles}` : (item.diferenciaGoles ?? 0)}
                      </td>
                      <td className="fw-bold bg-light text-primary fs-6">{item.puntos ?? 0}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="10" className="text-muted py-3">
                    No hay partidos registrados ni posiciones calculadas para esta jornada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TablaPosicionesJornada;