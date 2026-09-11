package com.leder.sistematorneos.service.IMP;

import com.leder.sistematorneos.entity.Equipo;
import com.leder.sistematorneos.repository.EquipoRepository;
import com.leder.sistematorneos.service.EquipoService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EquipoServiceIMP implements EquipoService {

    private final EquipoRepository equipoRepository;
    public EquipoServiceIMP(EquipoRepository equipoRepository){
        this.equipoRepository = equipoRepository;
    }

    @Override
    public Equipo registrarEquipo(Equipo equipo) {
        return equipoRepository.save(equipo);
    }

    @Override
    public Equipo consultarEquipo(int id) {
        if(!equipoRepository.existsById(id)){
            return null;
        }
        return equipoRepository.findById(id).orElse(null);
    }

    @Override
    public List<Equipo> listarEquipos() {
        return equipoRepository.findAll();
    }

    @Override
    public Equipo modificarEquipo(Equipo equipo) {
        return equipoRepository.save(equipo);
    }

    @Override
    public boolean eliminarTorneo(int id) {
        if(!equipoRepository.existsById(id)){
            return false;
        }
        equipoRepository.deleteById(id);
        return true;
    }
}
