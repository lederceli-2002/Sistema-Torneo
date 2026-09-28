package com.leder.sistematorneos.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

@Entity
@Table(name = "Torneo")
public class Torneo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idTorneo;

    @Column(nullable = false, length = 150)
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 150, message = "El nombre no debe superar 150 caracteres")
    private String nombre;

    @Column(length = 500)
    @Size(max = 500, message = "La descripcion no debe superar 500 caracteres")
    private String descripcion;

    @NotNull(message = "La fecha de inicio es obligatoria")
    private LocalDate fechaInicio;

    @NotNull(message = "La fecha de fin es obligatoria")
    private LocalDate fechaFin;

    @Column(nullable = false, length = 30)
    @NotBlank(message = "El estado es obligatorio")
    @Size(max = 30, message = "El estado no debe superar 30 caracteres")
    private String estado;

    public Torneo() {}

    public Integer getIdTorneo() { return idTorneo; }
    public void setIdTorneo(Integer idTorneo) { this.idTorneo = idTorneo; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }

    public LocalDate getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDate fechaFin) { this.fechaFin = fechaFin; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

}
