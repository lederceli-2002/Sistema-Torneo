package com.leder.sistematorneos.service.IMP;

import com.leder.sistematorneos.DTO.EquipoInscritoDTO;
import com.leder.sistematorneos.DTO.JugadorInscritoDTO;
import com.leder.sistematorneos.DTO.SerieCreacionDTO;
import com.leder.sistematorneos.DTO.TorneoCreacionDTO;
import com.leder.sistematorneos.DTO.TorneoDTO;
import com.leder.sistematorneos.entity.*;
import com.leder.sistematorneos.exception.DatosInvalidosException;
import com.leder.sistematorneos.exception.RecursoNoEncontradoException;
import com.leder.sistematorneos.exception.ReglaDeNegocioException;
import com.leder.sistematorneos.repository.*;
import com.leder.sistematorneos.service.TorneoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class TorneoServiceIMP implements TorneoService {

    private final JornadaRepository jornadaRepository;
    private final PartidoRepository partidoRepository;
    private final TorneoRepository torneoRepository;
    private final FaseRepository faseRepository;
    private final SerieRepository serieRepository;
    private final EquipoRepository equipoRepository;
    private final JugadorRepository jugadorRepository;
    private final ParticipacionEquipoTorneoRepository participacionEquipoTorneoRepository;
    private final ParticipacionJugadorTorneoRepository participacionJugadorTorneoRepository;

    public TorneoServiceIMP(JornadaRepository jornadaRepository, PartidoRepository partidoRepository, TorneoRepository torneoRepository,
                            FaseRepository faseRepository,
                            SerieRepository serieRepository,
                            EquipoRepository equipoRepository,
                            JugadorRepository jugadorRepository,
                            ParticipacionEquipoTorneoRepository participacionEquipoTorneoRepository,
                            ParticipacionJugadorTorneoRepository participacionJugadorTorneoRepository) {
        this.jornadaRepository = jornadaRepository;
        this.partidoRepository = partidoRepository;
        this.torneoRepository = torneoRepository;
        this.faseRepository = faseRepository;
        this.serieRepository = serieRepository;
        this.equipoRepository = equipoRepository;
        this.jugadorRepository = jugadorRepository;
        this.participacionEquipoTorneoRepository = participacionEquipoTorneoRepository;
        this.participacionJugadorTorneoRepository = participacionJugadorTorneoRepository;
    }

    @Override
    public List<TorneoDTO> listarTarjeteros() {
        return torneoRepository.tarjeterosTorneo();
    }

    @Override
    public Torneo registrarTorneo(Torneo torneo) {
        validarFechas(torneo);
        if (torneoRepository.existsByNombreIgnoreCase(torneo.getNombre())) {
            throw new ReglaDeNegocioException("Ya existe un torneo con el nombre: " + torneo.getNombre());
        }
        return torneoRepository.save(torneo);
    }

    @Override
    public Torneo consultarTorneo(int id) {
        return torneoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Torneo no encontrado con id " + id));
    }

    @Override
    public List<Torneo> listarTorneos() {
        return torneoRepository.findAll();
    }

    @Override
    public Torneo modificarTorneo(Torneo torneo) {
        if (!torneoRepository.existsById(torneo.getIdTorneo())) {
            throw new RecursoNoEncontradoException("Torneo no encontrado con id " + torneo.getIdTorneo());
        }
        validarFechas(torneo);
        if (torneoRepository.existsByNombreIgnoreCaseAndIdTorneoNot(torneo.getNombre(), torneo.getIdTorneo())) {
            throw new ReglaDeNegocioException("Ya existe otro torneo con el nombre: " + torneo.getNombre());
        }
        return torneoRepository.save(torneo);
    }

    @Override
    public boolean eliminarTorneo(int id) {
        if (!torneoRepository.existsById(id)) {
            throw new RecursoNoEncontradoException("Torneo no encontrado con id " + id);
        }
        if (participacionEquipoTorneoRepository.existsByTorneo_IdTorneo(id)) {
            throw new ReglaDeNegocioException("No se puede eliminar el torneo: tiene equipos inscritos");
        }
        torneoRepository.deleteById(id);
        return true;
    }

    @Override
    @Transactional
    public Torneo guardarTorneoConFixture(TorneoCreacionDTO dto) {
        // 1. Guardar la Entidad Torneo Principal
        Torneo torneo = new Torneo();
        torneo.setNombre(dto.getNombre());
        torneo.setDescripcion(dto.getDescripcion());
        torneo.setFechaInicio(dto.getFechaInicio());
        torneo.setFechaFin(dto.getFechaFin());
        torneo.setEstado("ACTIVO");

        Torneo torneoGuardado = torneoRepository.save(torneo);

        // 2. Crear la Fase Inicial/Única asociada al Torneo (Jerarquía DER)
        Fase fase = new Fase();
        fase.setNombre("Fase Regular");
        fase.setDescripcion("Fase inicial del torneo");
        fase.setOrden(1);
        fase.setTorneo(torneoGuardado);
        Fase faseGuardada = faseRepository.save(fase);

        // 3. Procesar las Series, Participaciones y Generar el Fixture Completo
        if (dto.getSeries() != null && !dto.getSeries().isEmpty()) {
            int contadorOrdenSerie = 1;

            for (SerieCreacionDTO serieDto : dto.getSeries()) {
                Serie serie = new Serie();
                serie.setNombre(serieDto.getNombre());
                serie.setFase(faseGuardada);
                serie.setOrden(contadorOrdenSerie++);

                Serie serieGuardada = serieRepository.save(serie);

                List<ParticipacionEquipoTorneo> participacionesSerie = new ArrayList<>();

                // 4. Registrar la Participación de cada Equipo en la Serie y Torneo
                if (serieDto.getEquipos() != null && !serieDto.getEquipos().isEmpty()) {
                    for (EquipoInscritoDTO equipoDto : serieDto.getEquipos()) {
                        Equipo equipo = equipoRepository.findById(equipoDto.getIdEquipo())
                                .orElseThrow(() -> new RecursoNoEncontradoException("Equipo no encontrado con ID: " + equipoDto.getIdEquipo()));

                        ParticipacionEquipoTorneo partEquipo = new ParticipacionEquipoTorneo();
                        partEquipo.setTorneo(torneoGuardado);
                        partEquipo.setSerie(serieGuardada);
                        partEquipo.setEquipo(equipo);
                        partEquipo.setEstado("ACTIVO");

                        ParticipacionEquipoTorneo partGuardada = participacionEquipoTorneoRepository.save(partEquipo);
                        participacionesSerie.add(partGuardada);

                        // Registrar Plantilla de Jugadores Inscritos
                        if (equipoDto.getJugadoresInscritos() != null && !equipoDto.getJugadoresInscritos().isEmpty()) {
                            for (JugadorInscritoDTO jugDto : equipoDto.getJugadoresInscritos()) {
                                if (jugDto.getIdJugador() != null) {
                                    Jugador jugador = jugadorRepository.findById(jugDto.getIdJugador())
                                            .orElseThrow(() -> new RecursoNoEncontradoException("Jugador no encontrado con ID: " + jugDto.getIdJugador()));

                                    ParticipacionJugadorTorneo partJugador = new ParticipacionJugadorTorneo();
                                    partJugador.setTorneo(torneoGuardado);
                                    partJugador.setEquipo(equipo);
                                    partJugador.setJugador(jugador);
                                    partJugador.setEstado("ACTIVO");
                                    partJugador.setFechaRegistro(LocalDate.now());

                                    participacionJugadorTorneoRepository.save(partJugador);
                                }
                            }
                        }
                    }
                }

                // 5. GENERACIÓN AUTOMÁTICA DE JORNADAS Y PARTIDOS (ALGORITMO ROUND-ROBIN)
                if (participacionesSerie.size() >= 2) {
                    List<ParticipacionEquipoTorneo> equiposRotacion = new ArrayList<>(participacionesSerie);

                    // Si la cantidad de equipos es impar, agregamos un comodín de descanso
                    boolean esImpar = equiposRotacion.size() % 2 != 0;
                    if (esImpar) {
                        equiposRotacion.add(null);
                    }

                    int totalEquipos = equiposRotacion.size();
                    int totalJornadas = totalEquipos - 1;
                    int partidosPorJornada = totalEquipos / 2;

                    for (int j = 0; j < totalJornadas; j++) {
                        // Guardar la Entidad Jornada
                        Jornada jornada = new Jornada();
                        jornada.setNombre("Jornada " + (j + 1));
                        jornada.setNumero(j + 1);
                        jornada.setSerie(serieGuardada);
                        Jornada jornadaGuardada = jornadaRepository.save(jornada);

                        for (int p = 0; p < partidosPorJornada; p++) {
                            ParticipacionEquipoTorneo local = equiposRotacion.get(p);
                            ParticipacionEquipoTorneo visitante = equiposRotacion.get(totalEquipos - 1 - p);

                            // Crear partido solo si ninguno de los dos descansa
                            if (local != null && visitante != null) {
                                Partido partido = new Partido();
                                partido.setJornada(jornadaGuardada);
                                partido.setEquipoLocal(local);
                                partido.setEquipoVisitante(visitante);
                                partido.setEstado("PENDIENTE");
                                partido.setFechaJuego(dto.getFechaInicio().plusDays(j * 7)); // Programación semanal inicial

                                partidoRepository.save(partido);
                            }
                        }

                        // Rotación Round-Robin de posiciones
                        ParticipacionEquipoTorneo ultimo = equiposRotacion.remove(equiposRotacion.size() - 1);
                        equiposRotacion.add(1, ultimo);
                    }
                }
            }
        }

        return torneoGuardado;
    }

    private void validarFechas(Torneo torneo) {
        if (torneo.getFechaInicio() != null && torneo.getFechaFin() != null
                && torneo.getFechaFin().isBefore(torneo.getFechaInicio())) {
            throw new DatosInvalidosException("La fecha de fin no puede ser anterior a la fecha de inicio");
        }
    }
}