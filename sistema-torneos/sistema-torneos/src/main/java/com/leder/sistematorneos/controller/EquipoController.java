package com.leder.sistematorneos.controller;

import com.leder.sistematorneos.DTO.EquipoConPlantillaDTO;
import com.leder.sistematorneos.DTO.EquipoJugadorRequestDTO;
import com.leder.sistematorneos.entity.Equipo;
import com.leder.sistematorneos.entity.EquipoJugador;
import com.leder.sistematorneos.entity.Jugador;
import com.leder.sistematorneos.exception.ReglaDeNegocioException;
import com.leder.sistematorneos.service.EquipoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

///CONTROLADOR CON SOLO CRUD
@RestController
@RequestMapping("/api/equipos")
public class EquipoController {

    private final EquipoService equipoService;

    public EquipoController(EquipoService equipoService){
        this.equipoService=equipoService;
    }

     /// 1
     @GetMapping
     public List<Equipo> listarEquipos(){
         return equipoService.listarEquipos();
     }

     /// 2
     @GetMapping("/{id}")
     public Equipo consultarEquipo(@PathVariable int id){
         return equipoService.consultarEquipo(id);
     }

     /// 3
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

     ///4
     @PutMapping("/{id}")
     public ResponseEntity<Equipo> actualizarEquipo(@PathVariable int id, @Valid @RequestBody Equipo e) {
         e.setIdEquipo(id); // Aseguras que el objeto tome el ID de la URL
         Equipo equipoActualizado = equipoService.modificarEquipo(e);
         return ResponseEntity.ok(equipoActualizado);
     }

     /// 5
     @DeleteMapping("/{id}")
     public ResponseEntity<?> eliminarEquipoCascada(@PathVariable int id) {
         try {
             boolean eliminado = equipoService.eliminarEquipoCascada(id);
             return ResponseEntity.ok(eliminado);
         } catch (ReglaDeNegocioException e) {
             return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
         } catch (Exception e) {
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                     .body("No se pudo eliminar el equipo: " + e.getMessage());
         }
     }

     /// 6
     @GetMapping("/{idEquipo}/plantilla-base")
     public ResponseEntity<List<Jugador>> obtenerPlantillaBaseEquipo(@PathVariable Integer idEquipo) {
         try {
             List<Jugador> plantilla = equipoService.obtenerPlantillaBaseEquipo(idEquipo);
             return ResponseEntity.ok(plantilla);
         } catch (Exception e) {
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
         }
     }

     /// 7. Agregar un jugador individual a la plantilla base del club
     @PostMapping("/{idEquipo}/plantilla")
     public ResponseEntity<?> agregarJugadorAPlantilla(@PathVariable Integer idEquipo, @RequestBody EquipoJugadorRequestDTO dto) {
         equipoService.agregarJugadorAPlantilla(idEquipo, dto.getIdJugador());
         return ResponseEntity.ok(Map.of("message", "Jugador agregado exitosamente a la plantilla base"));
     }

     /// 8. Remover un jugador individual de la plantilla base del club
     @DeleteMapping("/{idEquipo}/plantilla/{idJugador}")
     public ResponseEntity<?> removerJugadorDePlantilla(@PathVariable Integer idEquipo, @PathVariable Integer idJugador) {
         equipoService.removerJugadorDePlantilla(idEquipo, idJugador);
         return ResponseEntity.ok(Map.of("message", "Jugador removido exitosamente de la plantilla base"));
     }




     @GetMapping("/{idEquipo}/plantilla")
     public ResponseEntity<List<EquipoJugador>> obtenerPlantillaEquipo(@PathVariable Integer idEquipo) {
         List<EquipoJugador> plantilla = equipoService.obtenerPlantillaEquipo(idEquipo);
         return ResponseEntity.ok(plantilla);
     }



     /// auditoria para elimncion
     @PostMapping
     public Equipo registrarEquipo(@Valid @RequestBody Equipo e){
         return equipoService.registrarEquipo(e);
     }
     /// auditoria para elimncion




}