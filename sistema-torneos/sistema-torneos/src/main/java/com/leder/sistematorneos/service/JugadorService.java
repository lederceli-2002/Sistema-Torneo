package com.leder.sistematorneos.service;

import com.leder.sistematorneos.entity.Jugador;

import java.util.List;

public interface JugadorService {

    Jugador registrarJugador(Jugador jugador);

    Jugador consultarJugador(int id);

    List<Jugador> listarJugadores();

    Jugador modificarJugador(Jugador jugador);

    boolean eliminarJugador(int id);
}
