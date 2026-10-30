package com.leder.sistematorneos.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "equipo_jugador")
public class EquipoJugador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_equipo_jugador")
    private Integer idEquipoJugador;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_equipo", nullable = false)
    private Equipo equipo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_jugador", nullable = false)
    private Jugador jugador;

    @Column(name = "fecha_fichaje")
    private LocalDate fechaFichaje;

    @Column(nullable = false, length = 30)
    private String estado;

    // Constructor vacío por defecto
    public EquipoJugador() {
        this.fechaFichaje = LocalDate.now();
        this.estado = "ACTIVO";
    }

    // Constructor completo
    public EquipoJugador(Equipo equipo, Jugador jugador) {
        this.equipo = equipo;
        this.jugador = jugador;
        this.fechaFichaje = LocalDate.now();
        this.estado = "ACTIVO";
    }

    // Getters y Setters
    public Integer getIdEquipoJugador() {
        return idEquipoJugador;
    }

    public void setIdEquipoJugador(Integer idEquipoJugador) {
        this.idEquipoJugador = idEquipoJugador;
    }

    public Equipo getEquipo() {
        return equipo;
    }

    public void setEquipo(Equipo equipo) {
        this.equipo = equipo;
    }

    public Jugador getJugador() {
        return jugador;
    }

    public void setJugador(Jugador jugador) {
        this.jugador = jugador;
    }

    public LocalDate getFechaFichaje() {
        return fechaFichaje;
    }

    public void setFechaFichaje(LocalDate fechaFichaje) {
        this.fechaFichaje = fechaFichaje;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}