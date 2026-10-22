package com.leder.sistematorneos.controller;

import com.leder.sistematorneos.entity.Torneo;
import com.leder.sistematorneos.service.TorneoService;
import com.leder.sistematorneos.DTO.TorneoDTO;
import com.leder.sistematorneos.DTO.TorneoCreacionDTO;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/torneos")
public class TorneoController {

    private final TorneoService torneoService;

    public TorneoController(TorneoService torneoService){
        this.torneoService=torneoService;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Torneo> modificarTorneo(@PathVariable int id, @RequestBody Torneo torneo) {
        torneo.setIdTorneo(id);
        Torneo torneoActualizado = torneoService.modificarTorneo(torneo);
        return ResponseEntity.ok(torneoActualizado);
    }

    @PostMapping("/crear-con-fixture")
    public ResponseEntity<?> crearTorneoCompleto(@Valid @RequestBody TorneoCreacionDTO dto) {
        try {
            Torneo torneoCreado = torneoService.guardarTorneoConFixture(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(torneoCreado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al registrar el torneo: " + e.getMessage());
        }
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
