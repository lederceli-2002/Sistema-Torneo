package com.leder.sistematorneos.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "Jugador")
public class Jugador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idJugador;

    @Column(nullable = false, length = 100)
    private String nombres;

    @Column(nullable = false, length = 100)
    private String apellidos;

    private LocalDate fechaNacimiento;

    @Column(length = 20)
    private String dni;

    @Column(length = 100)
    private String nacionalidad;

    @Column(nullable = false, length = 30)
    private String estado;

    public Jugador() {}

    public Integer getIdJugador() { return idJugador; }
    public void setIdJugador(Integer idJugador) { this.idJugador = idJugador; }

    public String getNombres() { return nombres; }
    public void setNombres(String nombres) { this.nombres = nombres; }

    public String getApellidos() { return apellidos; }
    public void setApellidos(String apellidos) { this.apellidos = apellidos; }

    public LocalDate getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(LocalDate fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }

    public String getDni() { return dni; }
    public void setDni(String dni) { this.dni = dni; }

    public String getNacionalidad() { return nacionalidad; }
    public void setNacionalidad(String nacionalidad) { this.nacionalidad = nacionalidad; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

}
