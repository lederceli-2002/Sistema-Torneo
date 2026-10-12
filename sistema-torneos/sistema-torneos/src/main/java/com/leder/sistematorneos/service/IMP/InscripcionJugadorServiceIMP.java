package com.leder.sistematorneos.service.IMP;

import com.leder.sistematorneos.DTO.InscripcionJugadorDTO;
import com.leder.sistematorneos.entity.Equipo;
import com.leder.sistematorneos.entity.Jugador;
import com.leder.sistematorneos.entity.ParticipacionJugadorTorneo;
import com.leder.sistematorneos.entity.Torneo;
import com.leder.sistematorneos.exception.RecursoNoEncontradoException;
import com.leder.sistematorneos.exception.ReglaDeNegocioException;
import com.leder.sistematorneos.repository.EquipoRepository;
import com.leder.sistematorneos.repository.JugadorRepository;
import com.leder.sistematorneos.repository.ParticipacionEquipoTorneoRepository;
import com.leder.sistematorneos.repository.ParticipacionJugadorPartidoRepository;
import com.leder.sistematorneos.repository.ParticipacionJugadorTorneoRepository;
import com.leder.sistematorneos.repository.TorneoRepository;
import com.leder.sistematorneos.service.InscripcionJugadorService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class InscripcionJugadorServiceIMP implements InscripcionJugadorService {

    private final ParticipacionJugadorTorneoRepository participacionRepository;
    private final ParticipacionEquipoTorneoRepository participacionEquipoRepository;
    private final ParticipacionJugadorPartidoRepository participacionPartidoRepository;
    private final TorneoRepository torneoRepository;
    private final EquipoRepository equipoRepository;
    private final JugadorRepository jugadorRepository;

    // INYECCION POR CONSTRUCTOR
    public InscripcionJugadorServiceIMP(ParticipacionJugadorTorneoRepository participacionRepository,
                                        ParticipacionEquipoTorneoRepository participacionEquipoRepository,
                                        ParticipacionJugadorPartidoRepository participacionPartidoRepository,
                                        TorneoRepository torneoRepository,
                                        EquipoRepository equipoRepository,
                                        JugadorRepository jugadorRepository) {
        this.participacionRepository = participacionRepository;
        this.participacionEquipoRepository = participacionEquipoRepository;
        this.participacionPartidoRepository = participacionPartidoRepository;
        this.torneoRepository = torneoRepository;
        this.equipoRepository = equipoRepository;
        this.jugadorRepository = jugadorRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<InscripcionJugadorDTO> listarPorTorneo(int idTorneo) {
        return participacionRepository.findByTorneo_IdTorneoOrderByEquipo_NombreAscNumeroCamisetaAsc(idTorneo)
                .stream().map(this::aDTO).toList();
    }

    @Override
    @Transactional
    public InscripcionJugadorDTO inscribirJugador(InscripcionJugadorDTO dto) {
        Torneo torneo = torneoRepository.findById(dto.getIdTorneo())
                .orElseThrow(() -> new RecursoNoEncontradoException("Torneo no encontrado con id " + dto.getIdTorneo()));
        Equipo equipo = equipoRepository.findById(dto.getIdEquipo())
                .orElseThrow(() -> new RecursoNoEncontradoException("Equipo no encontrado con id " + dto.getIdEquipo()));
        Jugador jugador = jugadorRepository.findById(dto.getIdJugador())
                .orElseThrow(() -> new RecursoNoEncontradoException("Jugador no encontrado con id " + dto.getIdJugador()));
        String nombre = jugador.getNombres() + " " + jugador.getApellidos();

        if (!"Activo".equalsIgnoreCase(jugador.getEstado())) {
            throw new ReglaDeNegocioException("No se puede inscribir a " + nombre + ": esta inactivo");
        }
        // El equipo tiene que participar en el torneo
        if (!participacionEquipoRepository.existsByTorneo_IdTorneoAndEquipo_IdEquipo(torneo.getIdTorneo(), equipo.getIdEquipo())) {
            throw new ReglaDeNegocioException("El equipo " + equipo.getNombre() + " no esta inscrito en este torneo");
        }
        // Regla de negocio: un jugador no puede quedar inscrito dos veces en el mismo torneo
        if (participacionRepository.existsByTorneo_IdTorneoAndJugador_IdJugador(torneo.getIdTorneo(), jugador.getIdJugador())) {
            throw new ReglaDeNegocioException(nombre + " ya esta inscrito en este torneo");
        }
        if (participacionRepository.existsByTorneo_IdTorneoAndEquipo_IdEquipoAndNumeroCamiseta(
                torneo.getIdTorneo(), equipo.getIdEquipo(), dto.getNumeroCamiseta())) {
            throw new ReglaDeNegocioException("El numero " + dto.getNumeroCamiseta() + " ya lo usa otro jugador de " + equipo.getNombre());
        }

        ParticipacionJugadorTorneo inscripcion = new ParticipacionJugadorTorneo();
        inscripcion.setTorneo(torneo);
        inscripcion.setEquipo(equipo);
        inscripcion.setJugador(jugador);
        inscripcion.setNumeroCamiseta(dto.getNumeroCamiseta());
        inscripcion.setFechaRegistro(LocalDate.now());
        inscripcion.setEstado("Activo");
        return aDTO(participacionRepository.save(inscripcion));
    }

    @Override
    @Transactional
    public boolean retirarJugador(int idInscripcion) {
        ParticipacionJugadorTorneo inscripcion = participacionRepository.findById(idInscripcion)
                .orElseThrow(() -> new RecursoNoEncontradoException("Inscripcion no encontrada con id " + idInscripcion));

        // Si ya jugó, su historial de partidos, goles y tarjetas depende de esta inscripción
        if (participacionPartidoRepository.existsByParticipacionJugadorTorneo_IdParticipacionJugadorTorneo(idInscripcion)) {
            throw new ReglaDeNegocioException("No se puede retirar al jugador: ya tiene partidos registrados en el torneo");
        }
        participacionRepository.delete(inscripcion);
        return true;
    }

    // Convierte la entidad en DTO con los datos que necesita la pantalla
    private InscripcionJugadorDTO aDTO(ParticipacionJugadorTorneo p) {
        InscripcionJugadorDTO dto = new InscripcionJugadorDTO();
        dto.setIdInscripcion(p.getIdParticipacionJugadorTorneo());
        dto.setIdTorneo(p.getTorneo().getIdTorneo());
        dto.setIdEquipo(p.getEquipo().getIdEquipo());
        dto.setIdJugador(p.getJugador().getIdJugador());
        dto.setNumeroCamiseta(p.getNumeroCamiseta());
        dto.setNombreJugador(p.getJugador().getNombres() + " " + p.getJugador().getApellidos());
        dto.setDni(p.getJugador().getDni());
        dto.setFechaRegistro(p.getFechaRegistro());
        dto.setEstado(p.getEstado());
        return dto;
    }
}
