package com.leder.sistematorneos.service.IMP;

import com.leder.sistematorneos.DTO.InscripcionEquipoDTO;
import com.leder.sistematorneos.entity.Equipo;
import com.leder.sistematorneos.entity.ParticipacionEquipoTorneo;
import com.leder.sistematorneos.entity.Serie;
import com.leder.sistematorneos.entity.Torneo;
import com.leder.sistematorneos.exception.RecursoNoEncontradoException;
import com.leder.sistematorneos.exception.ReglaDeNegocioException;
import com.leder.sistematorneos.repository.EquipoRepository;
import com.leder.sistematorneos.repository.JornadaRepository;
import com.leder.sistematorneos.repository.ParticipacionEquipoTorneoRepository;
import com.leder.sistematorneos.repository.ParticipacionJugadorTorneoRepository;
import com.leder.sistematorneos.repository.SerieRepository;
import com.leder.sistematorneos.service.InscripcionEquipoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InscripcionEquipoServiceIMP implements InscripcionEquipoService {

    private final ParticipacionEquipoTorneoRepository participacionRepository;
    private final ParticipacionJugadorTorneoRepository participacionJugadorRepository;
    private final SerieRepository serieRepository;
    private final EquipoRepository equipoRepository;
    private final JornadaRepository jornadaRepository;

    // INYECCION POR CONSTRUCTOR
    public InscripcionEquipoServiceIMP(ParticipacionEquipoTorneoRepository participacionRepository,
                                       ParticipacionJugadorTorneoRepository participacionJugadorRepository,
                                       SerieRepository serieRepository,
                                       EquipoRepository equipoRepository,
                                       JornadaRepository jornadaRepository) {
        this.participacionRepository = participacionRepository;
        this.participacionJugadorRepository = participacionJugadorRepository;
        this.serieRepository = serieRepository;
        this.equipoRepository = equipoRepository;
        this.jornadaRepository = jornadaRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<InscripcionEquipoDTO> listarPorTorneo(int idTorneo) {
        return participacionRepository.findByTorneo_IdTorneoOrderByEquipo_NombreAsc(idTorneo)
                .stream().map(this::aDTO).toList();
    }

    @Override
    @Transactional
    public InscripcionEquipoDTO inscribirEquipo(InscripcionEquipoDTO dto) {
        Serie serie = serieRepository.findById(dto.getIdSerie())
                .orElseThrow(() -> new RecursoNoEncontradoException("Serie no encontrada con id " + dto.getIdSerie()));
        Equipo equipo = equipoRepository.findById(dto.getIdEquipo())
                .orElseThrow(() -> new RecursoNoEncontradoException("Equipo no encontrado con id " + dto.getIdEquipo()));
        // El torneo se obtiene de la serie: Serie -> Fase -> Torneo
        Torneo torneo = serie.getFase().getTorneo();

        if (!"Activo".equalsIgnoreCase(equipo.getEstado())) {
            throw new ReglaDeNegocioException("No se puede inscribir el equipo " + equipo.getNombre() + ": esta inactivo");
        }
        // Regla de negocio: un equipo no puede estar dos veces en el mismo torneo (ni en la misma serie)
        if (participacionRepository.existsByTorneo_IdTorneoAndEquipo_IdEquipo(torneo.getIdTorneo(), equipo.getIdEquipo())) {
            throw new ReglaDeNegocioException("El equipo " + equipo.getNombre() + " ya esta inscrito en este torneo");
        }
        // Con el fixture generado ya no se pueden cambiar los equipos de la serie
        if (jornadaRepository.existsBySerie_IdSerie(serie.getIdSerie())) {
            throw new ReglaDeNegocioException("No se pueden inscribir equipos: la serie ya tiene fixture generado");
        }

        ParticipacionEquipoTorneo inscripcion = new ParticipacionEquipoTorneo();
        inscripcion.setTorneo(torneo);
        inscripcion.setSerie(serie);
        inscripcion.setEquipo(equipo);
        inscripcion.setEstado("Activo");
        inscripcion.setObservaciones(dto.getObservaciones());
        return aDTO(participacionRepository.save(inscripcion));
    }

    @Override
    @Transactional
    public boolean retirarEquipo(int idInscripcion) {
        ParticipacionEquipoTorneo inscripcion = participacionRepository.findById(idInscripcion)
                .orElseThrow(() -> new RecursoNoEncontradoException("Inscripcion no encontrada con id " + idInscripcion));

        if (jornadaRepository.existsBySerie_IdSerie(inscripcion.getSerie().getIdSerie())) {
            throw new ReglaDeNegocioException("No se puede retirar el equipo: la serie ya tiene fixture generado");
        }
        if (participacionJugadorRepository.existsByTorneo_IdTorneoAndEquipo_IdEquipo(
                inscripcion.getTorneo().getIdTorneo(), inscripcion.getEquipo().getIdEquipo())) {
            throw new ReglaDeNegocioException("No se puede retirar el equipo: tiene jugadores inscritos en el torneo");
        }
        participacionRepository.delete(inscripcion);
        return true;
    }

    // Convierte la entidad en DTO con los datos que necesita la pantalla
    private InscripcionEquipoDTO aDTO(ParticipacionEquipoTorneo p) {
        InscripcionEquipoDTO dto = new InscripcionEquipoDTO();
        dto.setIdInscripcion(p.getIdParticipacionEquipoTorneo());
        dto.setIdTorneo(p.getTorneo().getIdTorneo());
        dto.setIdSerie(p.getSerie().getIdSerie());
        dto.setIdEquipo(p.getEquipo().getIdEquipo());
        dto.setNombreEquipo(p.getEquipo().getNombre());
        dto.setCiudad(p.getEquipo().getCiudad());
        dto.setEstado(p.getEstado());
        dto.setObservaciones(p.getObservaciones());
        return dto;
    }
}
