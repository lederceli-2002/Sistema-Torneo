package com.leder.sistematorneos.controller;

import com.leder.sistematorneos.entity.Fase;
import com.leder.sistematorneos.service.FaseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/SistemFutbol/Fases")
public class FaseController {

    private final FaseService faseService;
    public FaseController(FaseService faseService){
        this.faseService=faseService;
    }

    @PostMapping
    public Fase registrarFase(@RequestBody Fase fase){
        return faseService.registrarFase(fase);
    }
    @GetMapping("/{id}")
    public Fase consultarFase(@PathVariable int id){
        return faseService.consultarFase(id);
    }
    @GetMapping
    public List<Fase> listarFases(){
        return faseService.listarFases();
    }
    @PutMapping
    public Fase actualizarFase(@RequestBody Fase fase){
        return faseService.actualizarFase(fase);
    }
    @DeleteMapping("/{id}")
    public boolean eiminarFase(@PathVariable int id){
        return faseService.eliminarFase(id);
    }

}
