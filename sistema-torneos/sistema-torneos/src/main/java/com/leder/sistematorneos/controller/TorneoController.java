package com.leder.sistematorneos.controller;

import com.leder.sistematorneos.entity.Torneo;
import com.leder.sistematorneos.service.TorneoService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import com.leder.sistematorneos.DTO.TorneoDTO;

import java.util.List;

@RestController
@RequestMapping("/api/torneos")
public class TorneoController {

    private final TorneoService torneoService;

    public TorneoController(TorneoService torneoService){
        this.torneoService=torneoService;
    }

    @PostMapping
    public Torneo registrarTorneo(@Valid @RequestBody Torneo torneo){
        return torneoService.registrarTorneo(torneo);
    }

    @GetMapping("/{id}")
    public Torneo consultarTorneo(@PathVariable int id){
        return torneoService.consultarTorneo(id);
    }

    @GetMapping
    public List<Torneo> listarTorneos(){
        return torneoService.listarTorneos();
    }

    @GetMapping("/tarjeteros")
    public List<TorneoDTO> listarTarjeteros(){
        return torneoService.listarTarjeteros();
    }

    @PutMapping
    public Torneo actualizarTorneo(@Valid @RequestBody Torneo torneo){
        return torneoService.modificarTorneo(torneo);
    }

    @DeleteMapping("/{id}")
    public boolean eliminarTorneo(@PathVariable int id){
        return torneoService.eliminarTorneo(id);
    }

}
