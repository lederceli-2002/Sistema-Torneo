package com.leder.sistematorneos.service.IMP;

import com.leder.sistematorneos.entity.RankingJornada;
import com.leder.sistematorneos.repository.RankingJornadaRepository;
import com.leder.sistematorneos.service.RankingJornadaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RankingJornadaServiceIMP implements RankingJornadaService {

    @Autowired
    private RankingJornadaRepository rankingJornadaRepository;

    @Override
    public List<RankingJornada> obtenerRankingPorJornada(Integer idJornada) {
        if (idJornada == null) return List.of();
        // Usar la consulta explícita
        return rankingJornadaRepository.obtenerRankingPorIdJornada(idJornada);
    }
}