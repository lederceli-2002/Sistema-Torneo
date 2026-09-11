package com.leder.sistematorneos.entity;

import jakarta.persistence.*;


@Entity
@Table(name = "Equipo")
public class Equipo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idEquipo;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(length = 500)
    private String descripcion;

    @Column(length = 100)
    private String ciudad;

    @Column(length = 500)
    private String escudo;

    @Column(nullable = false, length = 30)
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
