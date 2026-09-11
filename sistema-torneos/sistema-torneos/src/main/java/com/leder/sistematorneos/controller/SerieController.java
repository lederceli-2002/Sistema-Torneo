package com.leder.sistematorneos.controller;



import com.leder.sistematorneos.entity.Serie;
import com.leder.sistematorneos.repository.SerieRepository;
import com.leder.sistematorneos.service.SerieService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/SistemaFutbol/Series")
public class SerieController {

    private final SerieService serieService;
    public SerieController(SerieService serieService){
        this.serieService=serieService;
    }

    @PostMapping
    public Serie registrarSerie(@RequestBody Serie serie){
        return serieService.registrarSerie(serie);
    }
    @GetMapping("/{id}")
    public Serie consultarSerie(@PathVariable int id){
        return serieService.consultarSerie(id);
    }
    @GetMapping
    public List<Serie> listarSeries(){
        return serieService.listarSeries();
    }
    @PutMapping
    public Serie actualizarSerie(@RequestBody Serie serie){
        return serieService.modificarSerie(serie);
    }
    @DeleteMapping("/{id}")
    public boolean eliminarSerie(@PathVariable int id){
        return serieService.eliminarSerie(id);
    }




}
