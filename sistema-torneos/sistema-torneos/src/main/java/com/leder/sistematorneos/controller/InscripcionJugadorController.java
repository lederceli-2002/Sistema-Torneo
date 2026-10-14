package com.leder.sistematorneos.controller;

import com.leder.sistematorneos.DTO.InscripcionJugadorDTO;
import com.leder.sistematorneos.service.InscripcionJugadorService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inscripciones/jugadores")
public class InscripcionJugadorController {

    private final InscripcionJugadorService inscripcionJugadorService;

    public InscripcionJugadorController(InscripcionJugadorService inscripcionJugadorService) {
        this.inscripcionJugadorService = inscripcionJugadorService;
    }

    // GET /api/inscripciones/jugadores?idTorneo=1
    @GetMapping
    public List<InscripcionJugadorDTO> listarPorTorneo(@RequestParam int idTorneo) {
        return inscripcionJugadorService.listarPorTorneo(idTorneo);
    }

    // POST /api/inscripciones/jugadores  { "idTorneo": 1, "idEquipo": 3, "idJugador": 10, "numeroCamiseta": 9 }
    @PostMapping
    public InscripcionJugadorDTO inscribirJugador(@Valid @RequestBody InscripcionJugadorDTO inscripcion) {
        return inscripcionJugadorService.inscribirJugador(inscripcion);
    }

    // DELETE /api/inscripciones/jugadores/5
    @DeleteMapping("/{id}")
    public boolean retirarJugador(@PathVariable int id) {
        return inscripcionJugadorService.retirarJugador(id);
    }
}
