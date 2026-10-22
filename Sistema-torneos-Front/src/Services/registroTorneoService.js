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

export const registrarTorneoCompleto = async (formTorneo, fixtureGenerado) => {
  const torneoPayload = {
    nombre: formTorneo.nombre,
    descripcion: formTorneo.descripcion,
    fechaInicio: formTorneo.fechaInicio,
    fechaFin: formTorneo.fechaFin,
    formato: formTorneo.formato,
    cantidadSeries: Number(formTorneo.cantidadSeries),
    series: (fixtureGenerado || []).map(serie => ({
      nombre: serie.nombreSerie || serie.nombre,
      equipos: (serie.equipos || []).map(eq => ({
        idEquipo: eq.idEquipo,
        jugadoresInscritos: (eq.jugadores || eq.jugadoresInscritos || []).map(j => ({
          idJugador: j.idJugador
        }))
      }))
    }))
  };

  const response = await axios.post(`${API_URL}/crear-con-fixture`, torneoPayload);
  return response.data;
};