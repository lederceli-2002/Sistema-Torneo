package com.leder.sistematorneos.DTO;

import java.util.List;

public class SerieCreacionDTO {
    private String nombre;
    private List<EquipoInscritoDTO> equipos;

    // Getters y Setters
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public List<EquipoInscritoDTO> getEquipos() { return equipos; }
    public void setEquipos(List<EquipoInscritoDTO> equipos) { this.equipos = equipos; }
}