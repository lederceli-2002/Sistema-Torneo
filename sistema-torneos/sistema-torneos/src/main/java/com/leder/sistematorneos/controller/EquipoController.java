package com.leder.sistematorneos.controller;

import com.leder.sistematorneos.entity.Equipo;
import com.leder.sistematorneos.service.EquipoService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipos")
public class EquipoController {

    private final EquipoService equipoService;

    public EquipoController(EquipoService equipoService){
        this.equipoService=equipoService;
    }

    @PostMapping
    public Equipo registrarEquipo(@Valid @RequestBody Equipo e){
        return equipoService.registrarEquipo(e);
    }

    @GetMapping("/{id}")
    public Equipo consultarEquipo(@PathVariable int id){
        return equipoService.consultarEquipo(id);
    }

    @GetMapping
    public List<Equipo> listarEquipos(){
        return equipoService.listarEquipos();
    }

    @PutMapping
    public Equipo actualizarEquipo(@Valid @RequestBody Equipo e){
        return equipoService.modificarEquipo(e);
    }

    @DeleteMapping("/{id}")
    public boolean eliminarEquipo(@PathVariable int id){
        return equipoService.eliminarEquipo(id);
    }

}