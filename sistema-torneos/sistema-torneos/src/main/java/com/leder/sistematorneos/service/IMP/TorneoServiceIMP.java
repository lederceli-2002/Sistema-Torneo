package com.leder.sistematorneos.service.IMP;

import com.leder.sistematorneos.entity.Torneo;
import com.leder.sistematorneos.service.TorneoService;
import com.leder.sistematorneos.repository.TorneoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TorneoServiceIMP implements TorneoService {

    //Conectamos con la capa del Repositorio
    private final TorneoRepository _TorneoRepository;

    public TorneoServiceIMP(TorneoRepository _TorneoRepository){
        this._TorneoRepository=_TorneoRepository;
    }

    @Override
    public Torneo registrarTorneo(Torneo torneo) {

        return _TorneoRepository.save(torneo);

    }

    @Override
    public Torneo consultarTorneo(int id) {
        return _TorneoRepository.findById(id).orElse(null);
    }

    @Override
    public List<Torneo> listarTorneos() {
        return _TorneoRepository.findAll();
    }

    @Override
    public Torneo modificarTorneo(Torneo torneo) {
        if(!_TorneoRepository.existsById(torneo.getIdTorneo())){
            return null;
        }
        return _TorneoRepository.save(torneo);
    }
    @Override
    public boolean eliminarTorneo(int id) {
        if(!_TorneoRepository.existsById(id)){
            return false;
        }
        _TorneoRepository.deleteById(id);
        return true;
    }
}
