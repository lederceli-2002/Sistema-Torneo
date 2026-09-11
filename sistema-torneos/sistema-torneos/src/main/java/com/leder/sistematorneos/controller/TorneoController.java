package com.leder.sistematorneos.controller;

import com.leder.sistematorneos.entity.Torneo;
import com.leder.sistematorneos.service.TorneoService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/SistemaFutbol/Torneos")
public class TorneoController {

    private final TorneoService torneoService;

    public TorneoController(TorneoService torneoService){
        this.torneoService=torneoService;
    }

    @PostMapping
    public Torneo registrarTorneo(@RequestBody Torneo torneo){
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

    @PutMapping
    public Torneo actualizarTorneo(@RequestBody Torneo torneo){
        return torneoService.modificarTorneo(torneo);
    }

    @DeleteMapping("/{id}")
    public boolean eliminarTorneo(@PathVariable int id){
        return torneoService.eliminarTorneo(id);
    }


}
