package com.leder.sistematorneos.controller;

import com.leder.sistematorneos.entity.Jugador;
import com.leder.sistematorneos.entity.ParticipacionJugadorTorneo;
import com.leder.sistematorneos.service.JugadorService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jugadores")
public class JugadorController {

    private final JugadorService jugadorService;

    public JugadorController(JugadorService jugadorService){
        this.jugadorService=jugadorService;
    }
    @GetMapping("/equipo/{idEquipo}")
    public List<ParticipacionJugadorTorneo> listarJugadoresPorEquipo(@PathVariable int idEquipo) {
        return jugadorService.listarJugadoresPorEquipo(idEquipo);
    }

    @PostMapping
    public Jugador registraJugador(@Valid @RequestBody Jugador j){
        return jugadorService.registrarJugador(j);
    }

    @GetMapping("/{id}")
    public Jugador consultarJugador(@PathVariable int id){
        return jugadorService.consultarJugador(id);
    }

    @GetMapping
    public List<Jugador> listarJugadores(){
        return jugadorService.listarJugadores();
    }

    @PutMapping
    public Jugador actualizarJugador(@Valid @RequestBody Jugador jugador){
        return jugadorService.modificarJugador(jugador);
    }

    @DeleteMapping("/{id}")
    public boolean eliminarJugador(@PathVariable int id){
        return jugadorService.eliminarJugador(id);
    }

}
