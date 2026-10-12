package com.leder.sistematorneos.service.IMP;

import com.leder.sistematorneos.DTO.SerieDTO;
import com.leder.sistematorneos.entity.Fase;
import com.leder.sistematorneos.entity.Serie;
import com.leder.sistematorneos.exception.RecursoNoEncontradoException;
import com.leder.sistematorneos.exception.ReglaDeNegocioException;
import com.leder.sistematorneos.repository.FaseRepository;
import com.leder.sistematorneos.repository.JornadaRepository;
import com.leder.sistematorneos.repository.ParticipacionEquipoTorneoRepository;
import com.leder.sistematorneos.repository.SerieRepository;
import com.leder.sistematorneos.service.SerieService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SerieServiceIMP implements SerieService {

    private final SerieRepository serieRepository;
    private final FaseRepository faseRepository;
    private final ParticipacionEquipoTorneoRepository participacionEquipoTorneoRepository;
    private final JornadaRepository jornadaRepository;

    // INYECCION POR CONSTRUCTOR
    public SerieServiceIMP(SerieRepository serieRepository,
                           FaseRepository faseRepository,
                           ParticipacionEquipoTorneoRepository participacionEquipoTorneoRepository,
                           JornadaRepository jornadaRepository) {
        this.serieRepository = serieRepository;
        this.faseRepository = faseRepository;
        this.participacionEquipoTorneoRepository = participacionEquipoTorneoRepository;
        this.jornadaRepository = jornadaRepository;
    }

    @Override
    public List<SerieDTO> listarPorFase(int idFase) {
        return serieRepository.findByFase_IdFaseOrderByOrdenAsc(idFase)
                .stream().map(this::aDTO).toList();
    }

    @Override
    public List<SerieDTO> listarPorTorneo(int idTorneo) {
        return serieRepository.findByFase_Torneo_IdTorneoOrderByFase_OrdenAscOrdenAsc(idTorneo)
                .stream().map(this::aDTO).toList();
    }

    @Override
    public SerieDTO consultarSerie(int id) {
        return aDTO(buscarSerie(id));
    }

    @Override
    public SerieDTO registrarSerie(SerieDTO dto) {
        Fase fase = buscarFase(dto.getIdFase());
        if (serieRepository.existsByFase_IdFaseAndNombreIgnoreCase(dto.getIdFase(), dto.getNombre())) {
            throw new ReglaDeNegocioException("La fase ya tiene una serie llamada: " + dto.getNombre());
        }
        Serie serie = new Serie();
        copiarDatos(dto, serie, fase);
        return aDTO(serieRepository.save(serie));
    }

    @Override
    public SerieDTO modificarSerie(SerieDTO dto) {
        Serie serie = buscarSerie(dto.getIdSerie());
        Fase fase = buscarFase(dto.getIdFase());
        if (serieRepository.existsByFase_IdFaseAndNombreIgnoreCaseAndIdSerieNot(
                dto.getIdFase(), dto.getNombre(), dto.getIdSerie())) {
            throw new ReglaDeNegocioException("La fase ya tiene otra serie llamada: " + dto.getNombre());
        }
        copiarDatos(dto, serie, fase);
        return aDTO(serieRepository.save(serie));
    }

    @Override
    public boolean eliminarSerie(int id) {
        buscarSerie(id);
        if (participacionEquipoTorneoRepository.existsBySerie_IdSerie(id)) {
            throw new ReglaDeNegocioException("No se puede eliminar la serie: tiene equipos inscritos");
        }
        if (jornadaRepository.existsBySerie_IdSerie(id)) {
            throw new ReglaDeNegocioException("No se puede eliminar la serie: ya tiene fixture generado");
        }
        serieRepository.deleteById(id);
        return true;
    }

    // ---------- Metodos de apoyo ----------

    private Serie buscarSerie(Integer id) {
        if (id == null) throw new RecursoNoEncontradoException("Debe indicar la serie");
        return serieRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Serie no encontrada con id " + id));
    }

    private Fase buscarFase(Integer id) {
        return faseRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Fase no encontrada con id " + id));
    }

    // Pasa los datos del DTO a la entidad
    private void copiarDatos(SerieDTO dto, Serie serie, Fase fase) {
        serie.setFase(fase);
        serie.setNombre(dto.getNombre());
        serie.setDescripcion(dto.getDescripcion());
        serie.setOrden(dto.getOrden());
    }

    // Convierte la entidad en DTO (solo con el id de la fase)
    private SerieDTO aDTO(Serie serie) {
        SerieDTO dto = new SerieDTO();
        dto.setIdSerie(serie.getIdSerie());
        dto.setIdFase(serie.getFase().getIdFase());
        dto.setNombre(serie.getNombre());
        dto.setDescripcion(serie.getDescripcion());
        dto.setOrden(serie.getOrden());
        return dto;
    }
}