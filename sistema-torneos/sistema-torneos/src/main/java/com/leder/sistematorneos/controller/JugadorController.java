package com.leder.sistematorneos.controller;

import com.leder.sistematorneos.entity.Jugador;
import com.leder.sistematorneos.service.JugadorService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/SistemaFutbol/Jugadores")
public class JugadorController {

    private final JugadorService jugadorService;

    public JugadorController(JugadorService jugadorService){
        this.jugadorService=jugadorService;
    }

    @PostMapping
    public Jugador registraJugador(@RequestBody Jugador j){
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
    public Jugador actualizarJugador(Jugador jugador){
        return jugadorService.modificarJugador(jugador);
    }
    @DeleteMapping("/{id}")
    public boolean eliminarJugador(@PathVariable int id){
        return jugadorService.eliminarJugador(id);
    }



}
