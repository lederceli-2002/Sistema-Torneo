package com.leder.sistematorneos.DTO;

import java.time.LocalDate;

public class TorneoDTO {

    private int id;
    private String nombre;
    private String estado;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;

    private int cantidadEquipos;
    private int series;
    private Integer proximaJornada;

    public TorneoDTO(){}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public int getCantidadEquipos() {
        return cantidadEquipos;
    }

    public void setCantidadEquipos(int cantidadEquipos) {
        this.cantidadEquipos = cantidadEquipos;
    }

    public int getSeries() {
        return series;
    }

    public void setSeries(int series) {
        this.series = series;
    }

    public Integer getProximaJornada() {
        return proximaJornada;
    }

    public void setProximaJornada(Integer proximaJornada) {
        this.proximaJornada = proximaJornada;
    }
}
