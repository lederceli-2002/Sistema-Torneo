package com.leder.sistematorneos.controller;
import com.leder.sistematorneos.entity.RankingJornada;
import com.leder.sistematorneos.service.PartidoService;
import com.leder.sistematorneos.service.RankingJornadaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ranking")
@CrossOrigin(origins = "*")
public class RankingJornadaController {

    @Autowired
    private RankingJornadaService rankingJornadaService;

    @Autowired
    private PartidoService partidoService;

    // En RankingJornadaController.java

    @GetMapping("/recalcular/{idJornada}")
    public ResponseEntity<String> recalcularRanking(@PathVariable Integer idJornada) {
        partidoService.recalcularRankingJornada(idJornada); // O invocar el método de servicio correspondiente
        return ResponseEntity.ok("Ranking recalculado con éxito para la jornada " + idJornada);
    }

    @GetMapping("/jornada/{idJornada}")
    public ResponseEntity<List<RankingJornada>> obtenerRankingPorJornada(@PathVariable Integer idJornada) {
        List<RankingJornada> ranking = rankingJornadaService.obtenerRankingPorJornada(idJornada);
        return ResponseEntity.ok(ranking);
    }
}