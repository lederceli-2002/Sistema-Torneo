package com.leder.sistematorneos.service.IMP;

import com.leder.sistematorneos.entity.Fase;
import com.leder.sistematorneos.repository.FaseRepository;
import com.leder.sistematorneos.service.FaseService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FaseServiceIMP implements FaseService {

    private final FaseRepository faseRepository;

    //  INYECCION POR CONTRUCTOR
    public FaseServiceIMP(FaseRepository faseRepository){
        this.faseRepository = faseRepository;
    }

    @Override
    public Fase registrarFase(Fase fase) {
        return faseRepository.save(fase);
    }

    @Override
    public Fase consultarFase(int id) {
        if(!faseRepository.existsById(id)){
            return null;
        }
       return faseRepository.findById(id).orElse(null);
    }

    @Override
    public List<Fase> listarFases() {
        return faseRepository.findAll();
    }

    @Override
    public Fase actualizarFase(Fase fase) {
        return faseRepository.save(fase);
    }

    @Override
    public boolean eliminarFase(int id) {
        if(!faseRepository.existsById(id)){
            return false;
        }
        faseRepository.deleteById(id);
        return true;
    }
}
