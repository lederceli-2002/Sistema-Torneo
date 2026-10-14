package com.leder.sistematorneos.controller;

import com.leder.sistematorneos.DTO.InscripcionEquipoDTO;
import com.leder.sistematorneos.service.InscripcionEquipoService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inscripciones/equipos")
public class InscripcionEquipoController {

    private final InscripcionEquipoService inscripcionEquipoService;

    public InscripcionEquipoController(InscripcionEquipoService inscripcionEquipoService) {
        this.inscripcionEquipoService = inscripcionEquipoService;
    }

    // GET /api/inscripciones/equipos?idTorneo=1
    @GetMapping
    public List<InscripcionEquipoDTO> listarPorTorneo(@RequestParam int idTorneo) {
        return inscripcionEquipoService.listarPorTorneo(idTorneo);
    }

    // POST /api/inscripciones/equipos   { "idSerie": 1, "idEquipo": 3 }
    @PostMapping
    public InscripcionEquipoDTO inscribirEquipo(@Valid @RequestBody InscripcionEquipoDTO inscripcion) {
        return inscripcionEquipoService.inscribirEquipo(inscripcion);
    }

    // DELETE /api/inscripciones/equipos/5
    @DeleteMapping("/{id}")
    public boolean retirarEquipo(@PathVariable int id) {
        return inscripcionEquipoService.retirarEquipo(id);
    }
}
