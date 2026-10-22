import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegistrarPartido.css';

const RegistrarPartido = () => {
  const { idPartido } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [partidoInfo, setPartidoInfo] = useState(null);
  
  // Listas de jugadores reales cargadas desde el Backend
  const [jugadoresLocal, setJugadoresLocal] = useState([]);
  const [jugadoresVisitante, setJugadoresVisitante] = useState([]);

  // Marcadores de goles
  const [golesLocal, setGolesLocal] = useState(0);
  const [golesVisitante, setGolesVisitante] = useState(0);

  // Lista de incidencias/eventos acumulados
  const [eventosList, setEventosList] = useState([]);

  // Formulario del nuevo evento
  const [nuevoEvento, setNuevoEvento] = useState({
    equipo: 'LOCAL',
    jugador: '',
    idJugador: null,
    tipo: 'GOL',
    minuto: ''
  });

  // Estados para el desplegable de búsqueda progresiva de jugadores
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const dropdownRef = useRef(null);

 
  useEffect(() => {
  const obtenerDatosPartido = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/partidos/${idPartido}`);
      if (res.data) {
        setPartidoInfo(res.data);

        // Cargar marcadores de goles reales
        if (res.data.golesLocal !== undefined) setGolesLocal(res.data.golesLocal);
        if (res.data.golesVisitante !== undefined) setGolesVisitante(res.data.golesVisitante);

        // Cargar tarjetas registradas previamente en la base de datos
        if (res.data.tarjetas && Array.isArray(res.data.tarjetas)) {
          const tarjetasMapeadas = res.data.tarjetas.map(t => ({
            id: t.idTarjeta || Date.now() + Math.random(),
            equipo: t.equipo || 'LOCAL',
            tipo: t.tipo === 'Amarilla' ? 'AMARILLA' : 'ROJA',
            jugador: t.jugador || 'Jugador',
            idJugador: t.idJugador,
            minuto: t.minuto
          }));
          setEventosList(tarjetasMapeadas);
        }

        // Extraer IDs de participación/equipo
        const idEquipoLocal = res.data.equipoLocal?.equipo?.idEquipo || res.data.equipoLocal?.idParticipacionEquipoTorneo || res.data.idEquipoLocal;
        const idEquipoVisitante = res.data.equipoVisitante?.equipo?.idEquipo || res.data.equipoVisitante?.idParticipacionEquipoTorneo || res.data.idEquipoVisitante;

        // Cargar plantilla de jugadores local
        if (idEquipoLocal) {
          const resLocal = await axios.get(`http://localhost:8080/api/jugadores/equipo/${idEquipoLocal}`);
          setJugadoresLocal(resLocal.data || []);
        }

        // Cargar plantilla de jugadores visitante
        if (idEquipoVisitante) {
          const resVisitante = await axios.get(`http://localhost:8080/api/jugadores/equipo/${idEquipoVisitante}`);
          setJugadoresVisitante(resVisitante.data || []);
        }
      }
    } catch (error) {
      console.error("Error al cargar datos del partido:", error);
    } finally {
      setLoading(false);
    }
  };

  if (idPartido) {
    obtenerDatosPartido();
  }
}, [idPartido]);
  

  // Cerrar el desplegable si se hace clic fuera del buscador
  useEffect(() => {
    const handleClickFuera = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMostrarDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickFuera);
    return () => document.removeEventListener('mousedown', handleClickFuera);
  }, []);

  // Lista activa de jugadores según el equipo seleccionado
  const listaJugadoresActual = nuevoEvento.equipo === 'LOCAL' ? jugadoresLocal : jugadoresVisitante;

// Filtrado progresivo en tiempo real conforme el usuario escribe
const jugadoresFiltrados = listaJugadoresActual.filter((j) => {
    const busqueda = (nuevoEvento.jugador || '').toLowerCase().trim();
    if (!busqueda) return true;

    // Extraer la entidad interna si viene anidada en 'jugador'
    const datosJugador = j.jugador || j;

    // Extraer valores del objeto jugador
    const nombre = (datosJugador.nombre || datosJugador.nombres || '').toLowerCase();
    const apellido = (datosJugador.apellido || datosJugador.apellidos || '').toLowerCase();
    const nombreCompleto = `${nombre} ${apellido}`.trim();
    const dni = (datosJugador.dni || '').toString();
    const camiseta = (j.numeroCamiseta || j.numero_camiseta || j.numeroDorsal || '').toString();

    return (
        nombreCompleto.includes(busqueda) ||
        nombre.includes(busqueda) ||
        apellido.includes(busqueda) ||
        dni.includes(busqueda) ||
        camiseta.includes(busqueda)
    );
});

const handleSeleccionarJugador = (jugadorObj) => {
    // Si viene anidado (ParticipacionJugadorTorneo) usamos jugadorObj.jugador, si no, el mismo objeto
    const datosJugador = jugadorObj.jugador || jugadorObj;

    const nombre = datosJugador.nombre || datosJugador.nombres || '';
    const apellido = datosJugador.apellido || datosJugador.apellidos || '';
    const nombreMostrar = `${nombre} ${apellido}`.trim() || 'Jugador seleccionado';

    // Priorizamos idParticipacionJugadorTorneo o idJugador
    const idAEnviar = jugadorObj.idParticipacionJugadorTorneo || datosJugador.idJugador || datosJugador.id_jugador || datosJugador.id;

    setNuevoEvento({
        ...nuevoEvento,
        jugador: nombreMostrar,
        idJugador: idAEnviar
    });
    setMostrarDropdown(false);
};

  // 3. Agregar evento a la lista
  const handleAgregarEvento = (e) => {
    e.preventDefault();
    if (!nuevoEvento.jugador || !nuevoEvento.minuto) {
      alert("Por favor selecciona un jugador e ingresa el minuto del evento.");
      return;
    }

    setEventosList([...eventosList, { ...nuevoEvento, id: Date.now() }]);

    // Incrementar marcador automáticamente si es Gol
    if (nuevoEvento.tipo === 'GOL') {
      if (nuevoEvento.equipo === 'LOCAL') setGolesLocal((prev) => prev + 1);
      if (nuevoEvento.equipo === 'VISITANTE') setGolesVisitante((prev) => prev + 1);
    }

    // Resetear campo del jugador
    setNuevoEvento({
      equipo: nuevoEvento.equipo,
      jugador: '',
      idJugador: null,
      tipo: 'GOL',
      minuto: ''
    });
  };

  // 4. Eliminar evento de la lista
  const handleEliminarEvento = (id) => {
    setEventosList(eventosList.filter((e) => e.id !== id));
  };

// 5. Guardar resultado final
const handleGuardarPartido = async () => {
  try {
    const payload = {
      idPartido: Number(idPartido),
      golesLocal: Number(golesLocal),
      golesVisitante: Number(golesVisitante),
      incidencias: eventosList.map((e) => ({
        equipo: e.equipo,
        tipoEvento: e.tipo,
        idJugador: Number(e.idJugador || e.jugadorId),
        minuto: Number(e.minuto || 0)
      }))
    };

    // Petición POST al endpoint correcto configurado en PartidoController.java
    await axios.post('http://localhost:8080/api/partidos/registrar', payload);
    
    alert("¡Resultado del partido registrado exitosamente!");
    navigate(-1);
  } catch (error) {
    console.error("Error al registrar el resultado:", error);
    alert("Ocurrió un error al guardar el resultado del partido.");
  }
};

  if (loading) {
    return <div className="registrar-partido-container">Cargando datos del encuentro...</div>;
  }

  const nombreLocal = partidoInfo?.local || partidoInfo?.equipoLocal?.equipo?.nombre || partidoInfo?.equipoLocal?.nombre || 'Equipo Local';
const nombreVisitante = partidoInfo?.visitante || partidoInfo?.equipoVisitante?.equipo?.nombre || partidoInfo?.equipoVisitante?.nombre || 'Equipo Visitante';

  return (
    <div className="registrar-partido-container">
      {/* Encabezado */}
      <div className="registrar-header">
        <h2>Registro de Resultado de Partido</h2>
        <button onClick={() => navigate(-1)} className="btn-volver">
          ← Volver al Fixture
        </button>
      </div>

      {/* Marcador Principal */}
      <div className="marcador-card">
        <div className="marcador-grid">
          <div className="equipo-box">
            <h2>{nombreLocal}</h2>
            <input
              type="number"
              min="0"
              value={golesLocal}
              onChange={(e) => setGolesLocal(Number(e.target.value))}
              className="input-goles"
            />
          </div>

          <div className="vs-divider">VS</div>

          <div className="equipo-box">
            <h2>{nombreVisitante}</h2>
            <input
              type="number"
              min="0"
              value={golesVisitante}
              onChange={(e) => setGolesVisitante(Number(e.target.value))}
              className="input-goles"
            />
          </div>
        </div>

        <div className="info-partido-bar">
          <span><strong>Fecha:</strong> {partidoInfo?.fechaHora || 'Programado'}</span>
          <span><strong>Estado Actual:</strong> {partidoInfo?.estado || 'PENDIENTE'}</span>
        </div>
      </div>

      {/* Formulario de Eventos / Incidencias */}
      <div className="seccion-eventos">
        <h3>Registrar Incidencia (Goles y Tarjetas)</h3>

        <form onSubmit={handleAgregarEvento} className="form-evento-grid">
          {/* Selección de Equipo */}
          <div className="form-field">
            <label>Equipo:</label>
            <select
              value={nuevoEvento.equipo}
              onChange={(e) => {
                setNuevoEvento({
                  ...nuevoEvento,
                  equipo: e.target.value,
                  jugador: '',
                  idJugador: null
                });
              }}
            >
              <option value="LOCAL">{nombreLocal} (Local)</option>
              <option value="VISITANTE">{nombreVisitante} (Visitante)</option>
            </select>
          </div>

          {/* Tipo de Evento */}
          <div className="form-field">
            <label>Tipo de Evento:</label>
            <select
              value={nuevoEvento.tipo}
              onChange={(e) => setNuevoEvento({ ...nuevoEvento, tipo: e.target.value })}
            >
              <option value="GOL">Gol</option>
              <option value="AMARILLA">Tarjeta Amarilla</option>
              <option value="ROJA">Tarjeta Roja</option>
            </select>
          </div>

          {/* Buscador Progresivo de Jugadores */}
          <div className="form-field autocomplete-container" ref={dropdownRef}>
            <label>Jugador:</label>
            <input
              type="text"
              placeholder="Escribe para buscar..."
              value={nuevoEvento.jugador}
              onFocus={() => setMostrarDropdown(true)}
              onChange={(e) => {
                setNuevoEvento({ ...nuevoEvento, jugador: e.target.value, idJugador: null });
                setMostrarDropdown(true);
              }}
            />

            {/* Desplegable Reactivo */}
            {mostrarDropdown && (
              <ul className="dropdown-jugadores">
                {jugadoresFiltrados.length > 0 ? (
    jugadoresFiltrados.map((j) => {
        const datosJugador = j.jugador || j;
        const idKey = j.idParticipacionJugadorTorneo || datosJugador.idJugador || datosJugador.id || datosJugador.dni;

        return (
            <li
                key={idKey}
                onClick={() => handleSeleccionarJugador(j)}
            >
                <span className="jugador-nombre">
                    {datosJugador.nombres} {datosJugador.apellidos}
                </span>
                {datosJugador.dni && <span className="jugador-dni">DNI: {datosJugador.dni}</span>}
                {j.numeroCamiseta && <span className="jugador-dorsal"> (#{j.numeroCamiseta})</span>}
            </li>
                  );
                  })
              ) : (
                  <li className="no-results">No se encontraron jugadores</li>
              )}
              </ul>
            )}
          </div>

          {/* Minuto del evento */}
          <div className="form-field">
            <label>Minuto:</label>
            <input
              type="number"
              min="1"
              max="120"
              placeholder="Ej: 45"
              value={nuevoEvento.minuto}
              onChange={(e) => setNuevoEvento({ ...nuevoEvento, minuto: e.target.value })}
            />
          </div>

          <button type="submit" className="btn-agregar-evento">
            + Añadir
          </button>
        </form>

        {/* Tabla de Incidencias Agregadas */}
        {eventosList.length > 0 && (
          <table className="tabla-eventos">
            <thead>
              <tr>
                <th>Equipo</th>
                <th>Evento</th>
                <th>Jugador</th>
                <th>Minuto</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {eventosList.map((item) => (
                <tr key={item.id}>
                  <td>{item.equipo === 'LOCAL' ? nombreLocal : nombreVisitante}</td>
                  <td>
                    <span className={`badge-tipo badge-${item.tipo.toLowerCase()}`}>
                      {item.tipo}
                    </span>
                  </td>
                  <td>{item.jugador}</td>
                  <td>{item.minuto}'</td>
                  <td>
                    <button
                      onClick={() => handleEliminarEvento(item.id)}
                      style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Acciones Finales */}
      <div className="acciones-finales">
        <button onClick={handleGuardarPartido} className="btn-guardar-partido">
          Finalizar y Guardar Partido
        </button>
      </div>
    </div>
  );
};

export default RegistrarPartido;