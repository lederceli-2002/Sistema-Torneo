package com.leder.sistematorneos.service;

import com.leder.sistematorneos.entity.Equipo;

import java.util.List;

public interface EquipoService {

    Equipo registrarEquipo(Equipo equipo);

    Equipo consultarEquipo(int id);

    List<Equipo> listarEquipos();

    Equipo modificarEquipo(Equipo equipo);

    boolean eliminarTorneo(int id);
}
