package com.leder.sistematorneos.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "Equipo")
public class Equipo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idEquipo;

    @Column(nullable = false, length = 150)
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 150, message = "El nombre no debe superar 150 caracteres")
    private String nombre;

    @Column(length = 500)
    @Size(max = 500, message = "La descripcion no debe superar 500 caracteres")
    private String descripcion;

    @Column(length = 100)
    @Size(max = 100, message = "La ciudad no debe superar 100 caracteres")
    private String ciudad;

    @Column(length = 500)
    @Size(max = 500, message = "La URL del escudo no debe superar 500 caracteres")
    private String escudo;

    @Column(nullable = false, length = 30)
    @NotBlank(message = "El estado es obligatorio")
    @Size(max = 30, message = "El estado no debe superar 30 caracteres")
    private String estado;

    public Equipo() {}

    public Integer getIdEquipo() { return idEquipo; }
    public void setIdEquipo(Integer idEquipo) { this.idEquipo = idEquipo; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getCiudad() { return ciudad; }
    public void setCiudad(String ciudad) { this.ciudad = ciudad; }

    public String getEscudo() { return escudo; }
    public void setEscudo(String escudo) { this.escudo = escudo; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

}