package com.leder.sistematorneos.service.IMP;

import com.leder.sistematorneos.DTO.TorneoDTO;
import com.leder.sistematorneos.entity.Torneo;
import com.leder.sistematorneos.exception.DatosInvalidosException;
import com.leder.sistematorneos.exception.RecursoNoEncontradoException;
import com.leder.sistematorneos.exception.ReglaDeNegocioException;
import com.leder.sistematorneos.repository.ParticipacionEquipoTorneoRepository;
import com.leder.sistematorneos.repository.TorneoRepository;
import com.leder.sistematorneos.service.TorneoService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TorneoServiceIMP implements TorneoService {

    private final TorneoRepository torneoRepository;
    private final ParticipacionEquipoTorneoRepository participacionEquipoTorneoRepository;

    public TorneoServiceIMP(TorneoRepository torneoRepository,
                            ParticipacionEquipoTorneoRepository participacionEquipoTorneoRepository){
        this.torneoRepository = torneoRepository;
        this.participacionEquipoTorneoRepository = participacionEquipoTorneoRepository;
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

    private void validarFechas(Torneo torneo) {
        if (torneo.getFechaInicio() != null && torneo.getFechaFin() != null
                && torneo.getFechaFin().isBefore(torneo.getFechaInicio())) {
            throw new DatosInvalidosException("La fecha de fin no puede ser anterior a la fecha de inicio");
        }
    }
}
