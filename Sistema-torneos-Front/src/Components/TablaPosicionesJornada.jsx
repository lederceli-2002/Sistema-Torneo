import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TablaPosicionesJornada.css';

const TablaPosicionesJornada = ({ idJornada }) => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idJornada) {
      setRanking([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get(`http://localhost:8080/api/ranking/jornada/${idJornada}`)
      .then((res) => {
        setRanking(res.data || []);
      })
      .catch((err) => {
        console.error('Error al obtener el ranking de la jornada:', err);
        setRanking([]);
      })
      .finally(() => setLoading(false));
  }, [idJornada]);

  if (loading) {
    return (
      <div className="tabla-ranking-container">
        <p>Cargando tabla de posiciones...</p>
      </div>
    );
  }

  if (!ranking || ranking.length === 0) {
    return (
      <div className="tabla-ranking-container">
        <p>No hay datos de ranking calculados para esta jornada.</p>
      </div>
    );
  }

  return (
    <div className="tabla-ranking-container">
      <h3>Tabla de Posiciones</h3>
      <table className="ranking-table">
        <thead>
          <tr>
            <th>Pos</th>
            <th className="col-equipo">Equipo</th>
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
          {ranking.map((fila, index) => {
            // Mapeo seguro para leer tanto las propiedades del backend DTO como abreviaciones
            const pj = fila.partidosJugados ?? fila.pj ?? 0;
            const pg = fila.ganados ?? fila.pg ?? 0;
            const pe = fila.empatados ?? fila.pe ?? 0;
            const pp = fila.perdidos ?? fila.pp ?? 0;
            const gf = fila.golesFavor ?? fila.gf ?? 0;
            const gc = fila.golesContra ?? fila.gc ?? 0;
            const dg = fila.diferenciaGoles ?? fila.dg ?? 0;
            const pts = fila.puntos ?? fila.pts ?? 0;

            return (
              <tr key={fila.idRankingJornada || index}>
                <td className="col-posicion">{fila.posicion || index + 1}</td>
                <td className="col-equipo">{fila.equipo || 'Equipo'}</td>
                <td>{pj}</td>
                <td>{pg}</td>
                <td>{pe}</td>
                <td>{pp}</td>
                <td>{gf}</td>
                <td>{gc}</td>
                <td>{dg}</td>
                <td className="col-puntos">{pts}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TablaPosicionesJornada;