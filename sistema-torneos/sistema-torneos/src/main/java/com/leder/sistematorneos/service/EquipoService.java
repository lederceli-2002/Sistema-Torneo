package com.leder.sistematorneos.service;

import com.leder.sistematorneos.DTO.EquipoConPlantillaDTO;
import com.leder.sistematorneos.entity.Equipo;
import com.leder.sistematorneos.entity.EquipoJugador;
import com.leder.sistematorneos.entity.Jugador;

import java.util.List;

public interface EquipoService {

    Equipo registrarEquipo(Equipo equipo);

    Equipo consultarEquipo(int id);

    List<Equipo> listarEquipos();

    Equipo modificarEquipo(Equipo equipo);

    boolean eliminarEquipo(int id);

    Equipo registrarEquipoPlantilla(EquipoConPlantillaDTO dto);

    List<Jugador> obtenerPlantillaBaseEquipo (Integer idEquipo);
    // Métodos para la gestión de plantilla base (EQUIPO_JUGADOR)
    List<EquipoJugador> obtenerPlantillaEquipo(Integer idEquipo);
    void agregarJugadorAPlantilla(Integer idEquipo, Integer idJugador);
    void removerJugadorDePlantilla(Integer idEquipo, Integer idJugador);
    public boolean eliminarEquipoCascada(int id);
}
