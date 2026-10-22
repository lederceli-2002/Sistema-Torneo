package com.leder.sistematorneos.controller;

import com.leder.sistematorneos.service.RankingJornadaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ranking")
@CrossOrigin(origins = "*")
public class RankingJornadaController {

    @Autowired
    private RankingJornadaService rankingJornadaService;

    // Endpoint por ID directo de jornada
    @GetMapping("/jornada/{idJornada}")
    public ResponseEntity<List<Map<String, Object>>> obtenerRankingPorJornada(@PathVariable Integer idJornada) {
        List<Map<String, Object>> ranking = rankingJornadaService.obtenerRankingPorJornada(idJornada);
        return ResponseEntity.ok(ranking);
    }

    // Endpoint alternativo por Torneo, Serie y número de Jornada
    @GetMapping("/torneo/{idTorneo}/serie/{nombreSerie}/jornada/{numeroJornada}")
    public ResponseEntity<List<Map<String, Object>>> obtenerRankingPorTorneoSerieYJornada(
            @PathVariable Integer idTorneo,
            @PathVariable String nombreSerie,
            @PathVariable Integer numeroJornada) {

        List<Map<String, Object>> ranking = rankingJornadaService.obtenerRankingPorTorneoSerieYJornada(idTorneo, nombreSerie, numeroJornada);
        return ResponseEntity.ok(ranking);
    }
}