package com.leder.sistematorneos.DTO;

import java.util.List;

public class EquipoInscritoDTO {
    private Integer idEquipo;
    private List<JugadorInscritoDTO> jugadoresInscritos;

    // Getters y Setters
    public Integer getIdEquipo() { return idEquipo; }
    public void setIdEquipo(Integer idEquipo) { this.idEquipo = idEquipo; }

    public List<JugadorInscritoDTO> getJugadoresInscritos() { return jugadoresInscritos; }
    public void setJugadoresInscritos(List<JugadorInscritoDTO> jugadoresInscritos) { this.jugadoresInscritos = jugadoresInscritos; }
}

