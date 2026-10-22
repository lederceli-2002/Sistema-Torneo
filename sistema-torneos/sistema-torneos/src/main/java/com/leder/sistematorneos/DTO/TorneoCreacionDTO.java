package com.leder.sistematorneos.DTO;

import java.time.LocalDate;
import java.util.List;

public class TorneoCreacionDTO {
    private String nombre;
    private String descripcion;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private String formato;
    private Integer cantidadSeries;
    private List<SerieCreacionDTO> series;

    // Getters y Setters
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }

    public LocalDate getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDate fechaFin) { this.fechaFin = fechaFin; }

    public String getFormato() { return formato; }
    public void setFormato(String formato) { this.formato = formato; }

    public Integer getCantidadSeries() { return cantidadSeries; }
    public void setCantidadSeries(Integer cantidadSeries) { this.cantidadSeries = cantidadSeries; }

    public List<SerieCreacionDTO> getSeries() { return series; }
    public void setSeries(List<SerieCreacionDTO> series) { this.series = series; }
}