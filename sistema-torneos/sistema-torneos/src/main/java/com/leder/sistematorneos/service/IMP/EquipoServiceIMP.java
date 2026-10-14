package com.leder.sistematorneos.service.IMP;

import com.leder.sistematorneos.entity.Equipo;
import com.leder.sistematorneos.exception.RecursoNoEncontradoException;
import com.leder.sistematorneos.exception.ReglaDeNegocioException;
import com.leder.sistematorneos.repository.EquipoRepository;
import com.leder.sistematorneos.repository.ParticipacionEquipoTorneoRepository;
import com.leder.sistematorneos.service.EquipoService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EquipoServiceIMP implements EquipoService {

    private final EquipoRepository equipoRepository;
    private final ParticipacionEquipoTorneoRepository participacionEquipoTorneoRepository;

    // INYECCION POR CONSTRUCTOR
    public EquipoServiceIMP(EquipoRepository equipoRepository,
                            ParticipacionEquipoTorneoRepository participacionEquipoTorneoRepository){
        this.equipoRepository = equipoRepository;
        this.participacionEquipoTorneoRepository = participacionEquipoTorneoRepository;
    }

    @Override
    public Equipo registrarEquipo(Equipo equipo) {
        if (equipoRepository.existsByNombreIgnoreCase(equipo.getNombre())) {
            throw new ReglaDeNegocioException("Ya existe un equipo con el nombre: " + equipo.getNombre());
        }
        return equipoRepository.save(equipo);
    }

    @Override
    public Equipo consultarEquipo(int id) {
        return equipoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Equipo no encontrado con id " + id));
    }

    @Override
    public List<Equipo> listarEquipos() {
        return equipoRepository.findAll();
    }

    @Override
    public Equipo modificarEquipo(Equipo equipo) {
        if (!equipoRepository.existsById(equipo.getIdEquipo())) {
            throw new RecursoNoEncontradoException("Equipo no encontrado con id " + equipo.getIdEquipo());
        }
        if (equipoRepository.existsByNombreIgnoreCaseAndIdEquipoNot(equipo.getNombre(), equipo.getIdEquipo())) {
            throw new ReglaDeNegocioException("Ya existe otro equipo con el nombre: " + equipo.getNombre());
        }
        return equipoRepository.save(equipo);
    }

    @Override
    public boolean eliminarEquipo(int id) {
        if (!equipoRepository.existsById(id)) {
            throw new RecursoNoEncontradoException("Equipo no encontrado con id " + id);
        }
        // Un equipo inscrito en un torneo tiene partidos y jugadores asociados
        if (participacionEquipoTorneoRepository.existsByEquipo_IdEquipo(id)) {
            throw new ReglaDeNegocioException("No se puede eliminar el equipo: esta inscrito en un torneo");
        }
        equipoRepository.deleteById(id);
        return true;
    }
}
