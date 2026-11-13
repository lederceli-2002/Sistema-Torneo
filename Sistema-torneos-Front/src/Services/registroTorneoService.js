import axios from 'axios';

const API_URL = 'http://localhost:8080/api/torneos';

// AGREGAR 'export' AQUÍ
export const obtenerEquiposDisponibles = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/equipos');
    return response.data;
  } catch (error) {
    console.error("Error al obtener la lista de equipos:", error);
    return [];
  }
};

// 2. NUEVA FUNCIÓN: Obtiene la plantilla base atemporal (EQUIPO_JUGADOR) de un equipo específico
export const obtenerPlantillaBaseEquipo = async (idEquipo) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/equipos/${idEquipo}/plantilla`);
    return response.data || [];
  } catch (error) {
    console.error(`Error al obtener la plantilla base del equipo ${idEquipo}:`, error);
    return [];
  }
};

export const registrarTorneoCompleto = async (formTorneo, fixtureGenerado) => {
  const seriesAProcesar = fixtureGenerado || formTorneo.series || [];

  const torneoPayload = {
    nombre: formTorneo.nombre,
    descripcion: formTorneo.descripcion,
    fechaInicio: formTorneo.fechaInicio,
    fechaFin: formTorneo.fechaFin,
    formato: formTorneo.formato,
    cantidadSeries: Number(formTorneo.cantidadSeries || 1),
    series: seriesAProcesar.map(serie => ({
      nombre: serie.nombreSerie || serie.nombre,
      equipos: (serie.equipos || []).map(eq => ({
        idEquipo: eq.idEquipo || eq.id_equipo || eq.id,
        jugadoresInscritos: (eq.jugadoresInscritos || eq.jugadores || []).map(j => ({ 
          idJugador: j.idJugador || j.id_jugador || j.id 
        }))
      }))
    }))
  };

  const response = await axios.post(`${API_URL}/crear-con-fixture`, torneoPayload);
  return response.data;
};