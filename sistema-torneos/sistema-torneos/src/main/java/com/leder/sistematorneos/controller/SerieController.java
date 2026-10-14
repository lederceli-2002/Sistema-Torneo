package com.leder.sistematorneos.controller;

import com.leder.sistematorneos.DTO.SerieDTO;
import com.leder.sistematorneos.exception.DatosInvalidosException;
import com.leder.sistematorneos.service.SerieService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/series")
public class SerieController {

    private final SerieService serieService;

    public SerieController(SerieService serieService) {
        this.serieService = serieService;
    }

    // GET /api/series?idFase=1   o   GET /api/series?idTorneo=1
    @GetMapping
    public List<SerieDTO> listar(@RequestParam(required = false) Integer idFase,
                                 @RequestParam(required = false) Integer idTorneo) {
        if (idFase != null) return serieService.listarPorFase(idFase);
        if (idTorneo != null) return serieService.listarPorTorneo(idTorneo);
        throw new DatosInvalidosException("Debe indicar idFase o idTorneo");
    }

    @GetMapping("/{id}")
    public SerieDTO consultarSerie(@PathVariable int id) {
        return serieService.consultarSerie(id);
    }

    @PostMapping
    public SerieDTO registrarSerie(@Valid @RequestBody SerieDTO serie) {
        return serieService.registrarSerie(serie);
    }

    @PutMapping
    public SerieDTO actualizarSerie(@Valid @RequestBody SerieDTO serie) {
        return serieService.modificarSerie(serie);
    }

    @DeleteMapping("/{id}")
    public boolean eliminarSerie(@PathVariable int id) {
        return serieService.eliminarSerie(id);
    }
}