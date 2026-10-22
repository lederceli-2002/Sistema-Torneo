package com.leder.sistematorneos.service;

import java.util.List;
import java.util.Map;

public interface RankingJornadaService {

    // Obtener ranking estructurado (limpio) por el ID directo de la jornada
    List<Map<String, Object>> obtenerRankingPorJornada(Integer idJornada);

    // Obtener ranking estructurado por Torneo, Serie y Número de Jornada
    List<Map<String, Object>> obtenerRankingPorTorneoSerieYJornada(Integer idTorneo, String nombreSerie, Integer numeroJornada);
}