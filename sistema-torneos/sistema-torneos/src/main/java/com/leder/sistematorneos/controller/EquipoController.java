package com.leder.sistematorneos.controller;

import com.leder.sistematorneos.DTO.EquipoConPlantillaDTO;
import com.leder.sistematorneos.entity.Equipo;
import com.leder.sistematorneos.exception.ReglaDeNegocioException;
import com.leder.sistematorneos.service.EquipoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
 ///CONTROLADOR CON SOLO CRUD
@RestController
@RequestMapping("/api/equipos")
public class EquipoController {

    private final EquipoService equipoService;

    public EquipoController(EquipoService equipoService){
        this.equipoService=equipoService;
    }


     @PostMapping("/crear-con-plantilla")
     public ResponseEntity<?> registrarEquipoConPlantilla(@RequestBody EquipoConPlantillaDTO dto) {
         try {
             Equipo equipoCreado = equipoService.registrarEquipoPlantilla(dto);
             return ResponseEntity.status(HttpStatus.CREATED).body(equipoCreado);
         } catch (ReglaDeNegocioException e) {
             return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
         } catch (Exception e) {
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                     .body("Error al crear el equipo: " + e.getMessage());
         }
     }

    /// auditoria para elimncion
    @PostMapping
    public Equipo registrarEquipo(@Valid @RequestBody Equipo e){
        return equipoService.registrarEquipo(e);
    }
     /// auditoria para elimncion


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