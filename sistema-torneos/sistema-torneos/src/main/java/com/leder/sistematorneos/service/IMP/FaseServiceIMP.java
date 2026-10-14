package com.leder.sistematorneos.service.IMP;

import com.leder.sistematorneos.DTO.FaseDTO;
import com.leder.sistematorneos.entity.Fase;
import com.leder.sistematorneos.entity.Torneo;
import com.leder.sistematorneos.exception.RecursoNoEncontradoException;
import com.leder.sistematorneos.exception.ReglaDeNegocioException;
import com.leder.sistematorneos.repository.FaseRepository;
import com.leder.sistematorneos.repository.SerieRepository;
import com.leder.sistematorneos.repository.TorneoRepository;
import com.leder.sistematorneos.service.FaseService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FaseServiceIMP implements FaseService {

    private final FaseRepository faseRepository;
    private final TorneoRepository torneoRepository;
    private final SerieRepository serieRepository;

    // INYECCION POR CONSTRUCTOR
    public FaseServiceIMP(FaseRepository faseRepository,
                          TorneoRepository torneoRepository,
                          SerieRepository serieRepository) {
        this.faseRepository = faseRepository;
        this.torneoRepository = torneoRepository;
        this.serieRepository = serieRepository;
    }

    @Override
    public List<FaseDTO> listarPorTorneo(int idTorneo) {
        return faseRepository.findByTorneo_IdTorneoOrderByOrdenAsc(idTorneo)
                .stream().map(this::aDTO).toList();
    }

    @Override
    public FaseDTO consultarFase(int id) {
        return aDTO(buscarFase(id));
    }

    @Override
    public FaseDTO registrarFase(FaseDTO dto) {
        Torneo torneo = buscarTorneo(dto.getIdTorneo());
        if (faseRepository.existsByTorneo_IdTorneoAndNombreIgnoreCase(dto.getIdTorneo(), dto.getNombre())) {
            throw new ReglaDeNegocioException("El torneo ya tiene una fase llamada: " + dto.getNombre());
        }
        Fase fase = new Fase();
        copiarDatos(dto, fase, torneo);
        return aDTO(faseRepository.save(fase));
    }

    @Override
    public FaseDTO actualizarFase(FaseDTO dto) {
        Fase fase = buscarFase(dto.getIdFase());
        Torneo torneo = buscarTorneo(dto.getIdTorneo());
        if (faseRepository.existsByTorneo_IdTorneoAndNombreIgnoreCaseAndIdFaseNot(
                dto.getIdTorneo(), dto.getNombre(), dto.getIdFase())) {
            throw new ReglaDeNegocioException("El torneo ya tiene otra fase llamada: " + dto.getNombre());
        }
        copiarDatos(dto, fase, torneo);
        return aDTO(faseRepository.save(fase));
    }

    @Override
    public boolean eliminarFase(int id) {
        buscarFase(id);
        if (serieRepository.existsByFase_IdFase(id)) {
            throw new ReglaDeNegocioException("No se puede eliminar la fase: primero elimine sus series");
        }
        faseRepository.deleteById(id);
        return true;
    }

    // ---------- Metodos de apoyo ----------

    private Fase buscarFase(Integer id) {
        if (id == null) throw new RecursoNoEncontradoException("Debe indicar la fase");
        return faseRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Fase no encontrada con id " + id));
    }

    private Torneo buscarTorneo(Integer id) {
        return torneoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Torneo no encontrado con id " + id));
    }

    // Pasa los datos del DTO a la entidad
    private void copiarDatos(FaseDTO dto, Fase fase, Torneo torneo) {
        fase.setTorneo(torneo);
        fase.setNombre(dto.getNombre());
        fase.setDescripcion(dto.getDescripcion());
        fase.setOrden(dto.getOrden());
    }

    // Convierte la entidad en DTO (solo con el id del torneo)
    private FaseDTO aDTO(Fase fase) {
        FaseDTO dto = new FaseDTO();
        dto.setIdFase(fase.getIdFase());
        dto.setIdTorneo(fase.getTorneo().getIdTorneo());
        dto.setNombre(fase.getNombre());
        dto.setDescripcion(fase.getDescripcion());
        dto.setOrden(fase.getOrden());
        return dto;
    }
}
