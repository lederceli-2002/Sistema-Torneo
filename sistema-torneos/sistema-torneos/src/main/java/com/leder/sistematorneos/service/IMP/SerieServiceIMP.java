package com.leder.sistematorneos.service.IMP;

import com.leder.sistematorneos.entity.Serie;
import com.leder.sistematorneos.repository.SerieRepository;
import com.leder.sistematorneos.service.SerieService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SerieServiceIMP implements SerieService {

    private final SerieRepository serieRepository;
    public SerieServiceIMP(SerieRepository serieRepository){
        this.serieRepository = serieRepository;
    }

    @Override
    public Serie registrarSerie(Serie serie) {
        return serieRepository.save(serie);
    }

    @Override
    public Serie consultarSerie(int id) {
        if(!serieRepository.existsById(id)){
            return null;
        }
        return serieRepository.findById(id).orElse(null);
    }

    @Override
    public List<Serie> listarSeries() {
        return serieRepository.findAll();
    }

    @Override
    public Serie modificarSerie(Serie serie) {
        return serieRepository.save(serie);
    }

    @Override
    public boolean eliminarSerie(int id) {
        if(!serieRepository.existsById(id)){
            return false;
        }
        serieRepository.deleteById(id);
        return true;
    }
}
