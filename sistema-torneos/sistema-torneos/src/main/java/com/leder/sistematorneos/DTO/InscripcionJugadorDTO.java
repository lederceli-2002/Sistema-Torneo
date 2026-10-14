package com.leder.sistematorneos.DTO;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

// Inscripción de un jugador en un equipo para un torneo (tabla participacion_jugador_torneo).
// Para inscribir se envían idTorneo, idEquipo, idJugador y numeroCamiseta.
public class InscripcionJugadorDTO {

    private Integer idInscripcion;

    @NotNull(message = "El torneo es obligatorio")
    private Integer idTorneo;

    @NotNull(message = "El equipo es obligatorio")
    private Integer idEquipo;

    @NotNull(message = "El jugador es obligatorio")
    private Integer idJugador;

    @NotNull(message = "El numero de camiseta es obligatorio")
    @Min(value = 1, message = "El numero de camiseta debe estar entre 1 y 99")
    @Max(value = 99, message = "El numero de camiseta debe estar entre 1 y 99")
    private Integer numeroCamiseta;

    // Datos de solo lectura para mostrar en pantalla
    private String nombreJugador;
    private String dni;
    private LocalDate fechaRegistro;
    private String estado;

    public InscripcionJugadorDTO() {}

    public Integer getIdInscripcion() { return idInscripcion; }
    public void setIdInscripcion(Integer idInscripcion) { this.idInscripcion = idInscripcion; }

    public Integer getIdTorneo() { return idTorneo; }
    public void setIdTorneo(Integer idTorneo) { this.idTorneo = idTorneo; }

    public Integer getIdEquipo() { return idEquipo; }
    public void setIdEquipo(Integer idEquipo) { this.idEquipo = idEquipo; }

    public Integer getIdJugador() { return idJugador; }
    public void setIdJugador(Integer idJugador) { this.idJugador = idJugador; }

    public Integer getNumeroCamiseta() { return numeroCamiseta; }
    public void setNumeroCamiseta(Integer numeroCamiseta) { this.numeroCamiseta = numeroCamiseta; }

    public String getNombreJugador() { return nombreJugador; }
    public void setNombreJugador(String nombreJugador) { this.nombreJugador = nombreJugador; }

    public String getDni() { return dni; }
    public void setDni(String dni) { this.dni = dni; }

    public LocalDate getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(LocalDate fechaRegistro) { this.fechaRegistro = fechaRegistro; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}
