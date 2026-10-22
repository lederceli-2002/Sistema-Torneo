package com.leder.sistematorneos.service;

import com.leder.sistematorneos.entity.RankingJornada;
import java.util.List;

public interface RankingJornadaService {
    List<RankingJornada> obtenerRankingPorJornada(Integer idJornada);
}