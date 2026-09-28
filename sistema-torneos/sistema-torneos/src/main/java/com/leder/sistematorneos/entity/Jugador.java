package com.leder.sistematorneos.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

@Entity
@Table(name = "Jugador")
public class Jugador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idJugador;

    @Column(nullable = false, length = 100)
    @NotBlank(message = "Los nombres son obligatorios")
    @Size(max = 100, message = "Los nombres no deben superar 100 caracteres")
    private String nombres;

    @Column(nullable = false, length = 100)
    @NotBlank(message = "Los apellidos son obligatorios")
    @Size(max = 100, message = "Los apellidos no deben superar 100 caracteres")
    private String apellidos;

    @Past(message = "La fecha de nacimiento debe ser anterior a hoy")
    private LocalDate fechaNacimiento;

    @Column(length = 20)
    @Size(max = 20, message = "El DNI no debe superar 20 caracteres")
    private String dni;

    @Column(length = 100)
    @Size(max = 100, message = "La nacionalidad no debe superar 100 caracteres")
    private String nacionalidad;

    @Column(nullable = false, length = 30)
    @NotBlank(message = "El estado es obligatorio")
    @Size(max = 30, message = "El estado no debe superar 30 caracteres")
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
