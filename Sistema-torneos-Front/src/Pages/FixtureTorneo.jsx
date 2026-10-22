import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FixtureTorneo.css';
import TablaPosicionesJornada from '../Components/TablaPosicionesJornada';
import ModalTarjetasJornada from '../Components/ModalTarjetasJornada';



const FixtureTorneo = () => {
  const { idTorneo } = useParams();
  const navigate = useNavigate();

  // Estados de información general y filtros
  const [torneoInfo, setTorneoInfo] = useState({
    nombre: '',
    fechaInicio: '',
    fechaFin: ''
  });

  const [serieSeleccionada, setSerieSeleccionada] = useState('Serie A');
  const [jornadaSeleccionada, setJornadaSeleccionada] = useState(1);
  const [partidosLista, setPartidosLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModalTarjetas, setMostrarModalTarjetas] = useState(false);

    
  // Estados para la Modal de Edición Rápida (Nombre y Fechas del Torneo)
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [formEditarTorneo, setFormEditarTorneo] = useState({
    nombre: '',
    fechaInicio: '',
    fechaFin: ''
  });

  // 1. Cargar datos del torneo y partidos globales
  useEffect(() => {
    const cargarDatosTorneoYFixture = async () => {
      setLoading(true);
      try {
        const resTorneo = await axios.get(`http://localhost:8080/api/torneos/${idTorneo}`);
        if (resTorneo.data) {
          const datos = {
            nombre: resTorneo.data.nombre || `Torneo #${idTorneo}`,
            fechaInicio: resTorneo.data.fechaInicio || '',
            fechaFin: resTorneo.data.fechaFin || ''
          };
          setTorneoInfo(datos);
          setFormEditarTorneo(datos); // Inicializa los campos de la modal
        }

        const resFixture = await axios.get(`http://localhost:8080/api/partidos/torneo/${idTorneo}`);

        if (resFixture.data && Array.isArray(resFixture.data) && resFixture.data.length > 0) {
          
          const partidosNormalizados = resFixture.data.map((p) => {
          // Extraer el idJornada del DTO o de la entidad
          const idJornadaExtraido = p.idJornada || p.id_jornada || (typeof p.jornada === 'object' ? p.jornada?.idJornada : p.jornada);
          const numJornadaExtraido = p.numeroJornada || p.numero_jornada || (typeof p.jornada === 'object' ? p.jornada?.numero : 1);

          return {
            idPartido: p.idPartido || p.id_partido || p.id,
            local: p.local || p.equipoLocal?.nombre || p.equipoLocal?.equipo?.nombre || 'Equipo Local',
            visitante: p.visitante || p.equipoVisitante?.nombre || p.equipoVisitante?.equipo?.nombre || 'Equipo Visitante',
            fechaHora: p.fechaJuego || p.fechaHora || 'Por programar',
            estado: p.estado || 'PENDIENTE',
            serie: p.serie?.nombre || p.nombreSerie || (typeof p.serie === 'string' ? p.serie : 'Serie A'),
            numeroJornada: Number(numJornadaExtraido),
            idJornada: idJornadaExtraido ? Number(idJornadaExtraido) : null
          };
        });

          setPartidosLista(partidosNormalizados);
        } else {
          setPartidosLista([]);
        }
      } catch (error) {
        console.error(`Error al cargar datos del torneo ${idTorneo}:`, error);
        setPartidosLista([]);
      } finally {
        setLoading(false);
      }
    };

    if (idTorneo) {
      cargarDatosTorneoYFixture();
    }
  }, [idTorneo]);

 // Función para guardar la edición rápida del Torneo
const handleGuardarConfiguracionTorneo = async (e) => {
  e.preventDefault();
  try {
    // 1. Consultar el estado actual del torneo para no perder sus relaciones/datos
    const resTorneoActual = await axios.get(`http://localhost:8080/api/torneos/${idTorneo}`);
    const torneoData = resTorneoActual.data;

    // 2. Armar el objeto Torneo actualizando los campos editados en la modal
    const payloadTorneo = {
      ...torneoData,
      idTorneo: Number(idTorneo),
      nombre: formEditarTorneo.nombre,
      fechaInicio: formEditarTorneo.fechaInicio,
      fechaFin: formEditarTorneo.fechaFin
    };

    // 3. Petición PUT al endpoint @PutMapping("/{id}") que ejecuta modificarTorneo
    const res = await axios.put(`http://localhost:8080/api/torneos/${idTorneo}`, payloadTorneo);

    if (res.status === 200 || res.status === 201) {
      // Actualizar la interfaz local
      setTorneoInfo({
        nombre: formEditarTorneo.nombre,
        fechaInicio: formEditarTorneo.fechaInicio,
        fechaFin: formEditarTorneo.fechaFin
      });
      setMostrarModalEditar(false);
      alert('¡Datos del torneo actualizados correctamente!');
    }
  } catch (error) {
    console.error('Error detallado al modificar el torneo:', error.response?.data || error.message);
    alert(`Ocurrió un error al actualizar los datos del torneo: ${error.response?.data?.message || 'Verifica la consola para más detalles.'}`);
  }
};
 

  // Filtro dinámico en tiempo real para mostrar los partidos en pantalla
  const partidosFiltrados = partidosLista.filter((p) => {
    const seriePartido = p.serie ? p.serie.toString().toLowerCase().trim() : '';
    const serieFiltro = serieSeleccionada ? serieSeleccionada.toString().toLowerCase().trim() : '';

    const coincideSerie = seriePartido === serieFiltro ||
      seriePartido.includes(serieFiltro) ||
      serieFiltro.includes(seriePartido);

    const coincideJornada = Number(p.numeroJornada) === Number(jornadaSeleccionada);

    return coincideSerie && coincideJornada;
  });

  // Buscar el partido que corresponda a la Jornada y Serie seleccionadas
  const partidoCoincidente = partidosLista.find(p => 
    Number(p.numeroJornada) === Number(jornadaSeleccionada) && 
    (p.serie.toString().toLowerCase().includes(serieSeleccionada.toString().toLowerCase()) ||
     serieSeleccionada.toString().toLowerCase().includes(p.serie.toString().toLowerCase()))
  ) || partidosLista.find(p => Number(p.numeroJornada) === Number(jornadaSeleccionada)) || partidosLista[0];

  // Extraer el idJornada real asignado por Supabase
  const idJornadaReal = partidoCoincidente?.idJornada || null;

  console.log("📌 SERIE Y JORNADA FILTRADA:", serieSeleccionada, "Jornada", jornadaSeleccionada, "➡️ ID REAL BD:", idJornadaReal);
 

  return (
    <div className="fixture-container">
      {/* Encabezado */}
      <div className="fixture-header">
        <div>
          <h1>Fixture del torneo</h1>
          <p>
            {torneoInfo.nombre}
            {torneoInfo.fechaInicio && torneoInfo.fechaFin && (
              ` - ${torneoInfo.fechaInicio} a ${torneoInfo.fechaFin}`
            )}
          </p>
        </div>
        {/* BOTÓN RESTAURADO: Abre la modal de edición en vez de redirigir */}
        <button
          onClick={() => setMostrarModalEditar(true)}
          className="btn-configurar"
        >
          Configurar Torneo
        </button>

        <button 
        className="btn-tarjetas-jornada"
        onClick={() => setMostrarModalTarjetas(true)}
        style={{ background: '#3b82f6', color: '#fff', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
      >
         Ver Tarjetas de la Jornada
      </button>
      </div>

      {/* Panel de Filtros */}
      <div className="filters-panel">
        <div className="filter-group">
          <label>Serie:</label>
          <select
            value={serieSeleccionada}
            onChange={(e) => setSerieSeleccionada(e.target.value)}
            className="select-custom"
          >
            <option value="Serie A">Serie A</option>
            <option value="Serie B">Serie B</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Jornada:</label>
          <select
            value={jornadaSeleccionada}
            onChange={(e) => setJornadaSeleccionada(Number(e.target.value))}
            className="select-custom"
          >
            <option value={1}>Jornada 1</option>
            <option value={2}>Jornada 2</option>
          </select>
        </div>
      </div>

      {/* Partidos */}
      {loading ? (
        <div className="loading-state">Cargando partidos...</div>
      ) : partidosFiltrados.length > 0 ? (
        <div className="partidos-grid">
          {partidosFiltrados.map((partido) => (
            <div key={partido.idPartido} className="card-partido">
              <div className="match-teams">
                <span className="team-name">{partido.local}</span>
                <span className="badge-vs">VS</span>
                <span className="team-name">{partido.visitante}</span>
              </div>
              <div className="match-footer">
                <span>Fecha: {partido.fechaHora}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    className={`status-badge ${
                      partido.estado === 'FINALIZADO' ? 'status-finalizado' : 'status-pendiente'
                    }`}
                  >
                    {partido.estado}
                  </span>
                    <button
                      onClick={() => {
                        const idValido = partido.idPartido || partido.id_partido || partido.id;
                        if (idValido) {
                          navigate(`/partidos/registrar/${idValido}`);
                        }
                      }}
                      className="btn-configurar"
                      style={{
                        padding: '6px 12px',
                        fontSize: '12px',
                        backgroundColor:
                          partido.estado?.toUpperCase() === 'FINALIZADO' ? '#475569' : '#2563eb'
                      }}
                    >
                      {partido.estado?.toUpperCase() === 'FINALIZADO'
                        ? 'Ver Resultado'
                        : 'Registrar Partido'}
                    </button>
                    
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          No hay partidos programados para la <strong>{serieSeleccionada}</strong> en la <strong>Jornada {jornadaSeleccionada}</strong>.
        </div>
      )}
      
      <TablaPosicionesJornada
        key={`ranking-${idJornadaReal || jornadaSeleccionada}`}
        idJornada={idJornadaReal}
      />

    {/* MODAL DE TARJETAS DE LA JORNADA */}
      <ModalTarjetasJornada
          isOpen={mostrarModalTarjetas}
          onClose={() => setMostrarModalTarjetas(false)}
          idJornada={idJornadaReal || jornadaSeleccionada}
          serieNombre={serieSeleccionada}
          numeroJornada={jornadaSeleccionada}
      />

      {/* MODAL DE EDICIÓN RÁPIDA DE TORNEO (Nombre y Fechas) */}
      {mostrarModalEditar && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Configurar Datos del Torneo</h2>
            <form onSubmit={handleGuardarConfiguracionTorneo}>
              <div className="form-group">
                <label>Nombre del Torneo:</label>
                <input
                  type="text"
                  value={formEditarTorneo.nombre}
                  onChange={(e) =>
                    setFormEditarTorneo({ ...formEditarTorneo, nombre: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Fecha de Inicio:</label>
                <input
                  type="date"
                  value={formEditarTorneo.fechaInicio}
                  onChange={(e) =>
                    setFormEditarTorneo({ ...formEditarTorneo, fechaInicio: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Fecha de Fin:</label>
                <input
                  type="date"
                  value={formEditarTorneo.fechaFin}
                  onChange={(e) =>
                    setFormEditarTorneo({ ...formEditarTorneo, fechaFin: e.target.value })
                  }
                  required
                />
              </div>

              <div className="modal-buttons">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => setMostrarModalEditar(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-guardar">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FixtureTorneo;