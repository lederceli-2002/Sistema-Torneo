package com.leder.sistematorneos.controller;

import com.leder.sistematorneos.entity.Equipo;
import com.leder.sistematorneos.service.EquipoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/SistemaFutbol/Equipos")
public class EquipoController {

    private final EquipoService equipoService;
    public EquipoController(EquipoService equipoService){
        this.equipoService=equipoService;
    }

    @PostMapping
    public Equipo registrarEquipo(@RequestBody Equipo e){
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
    public Equipo actualizarEquipo(@RequestBody Equipo e){
        return equipoService.modificarEquipo(e);
    }
    @DeleteMapping("/{id}")
    public boolean eliminarEquipo(@PathVariable int id){
        return equipoService.eliminarTorneo(id);
    }

}
