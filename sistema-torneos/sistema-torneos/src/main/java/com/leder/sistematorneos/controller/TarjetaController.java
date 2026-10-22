package com.leder.sistematorneos.controller;

import com.leder.sistematorneos.service.TarjetaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tarjetas")
@CrossOrigin(origins = "*")
public class TarjetaController {

    @Autowired
    private TarjetaService tarjetaService;

    @GetMapping("/jornada/{idJornada}")
    public ResponseEntity<List<Map<String, Object>>> obtenerTarjetasPorJornada(@PathVariable Integer idJornada) {
        List<Map<String, Object>> tarjetas = tarjetaService.obtenerTarjetasPorJornada(idJornada);
        return ResponseEntity.ok(tarjetas);
    }
}