package com.leder.sistematorneos.controller;

import com.leder.sistematorneos.DTO.FaseDTO;
import com.leder.sistematorneos.service.FaseService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fases")
public class FaseController {

    private final FaseService faseService;

    public FaseController(FaseService faseService) {
        this.faseService = faseService;
    }

    // GET /api/fases?idTorneo=1
    @GetMapping
    public List<FaseDTO> listarPorTorneo(@RequestParam int idTorneo) {
        return faseService.listarPorTorneo(idTorneo);
    }

    @GetMapping("/{id}")
    public FaseDTO consultarFase(@PathVariable int id) {
        return faseService.consultarFase(id);
    }

    @PostMapping
    public FaseDTO registrarFase(@Valid @RequestBody FaseDTO fase) {
        return faseService.registrarFase(fase);
    }

    @PutMapping
    public FaseDTO actualizarFase(@Valid @RequestBody FaseDTO fase) {
        return faseService.actualizarFase(fase);
    }

    @DeleteMapping("/{id}")
    public boolean eliminarFase(@PathVariable int id) {
        return faseService.eliminarFase(id);
    }
}