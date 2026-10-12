package com.leder.sistematorneos.DTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

// Datos de una serie que viajan entre el front y el back.
public class SerieDTO {

    private Integer idSerie;

    @NotNull(message = "La fase es obligatoria")
    private Integer idFase;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no debe superar 100 caracteres")
    private String nombre;

    @Size(max = 500, message = "La descripcion no debe superar 500 caracteres")
    private String descripcion;

    @NotNull(message = "El orden es obligatorio")
    @Min(value = 1, message = "El orden debe ser mayor o igual a 1")
    private Integer orden;

    public SerieDTO() {}

    public Integer getIdSerie() { return idSerie; }
    public void setIdSerie(Integer idSerie) { this.idSerie = idSerie; }

    public Integer getIdFase() { return idFase; }
    public void setIdFase(Integer idFase) { this.idFase = idFase; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Integer getOrden() { return orden; }
    public void setOrden(Integer orden) { this.orden = orden; }
}