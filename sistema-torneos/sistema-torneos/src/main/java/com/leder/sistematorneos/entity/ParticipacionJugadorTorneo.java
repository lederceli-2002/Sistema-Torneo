package com.leder.sistematorneos.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "ParticipacionJugadorTorneo")
public class ParticipacionJugadorTorneo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idParticipacionJugadorTorneo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idTorneo", nullable = false)
    private Torneo torneo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idEquipo", nullable = false)
    private Equipo equipo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idJugador", nullable = false)
    private Jugador jugador;

    private Integer numeroCamiseta;

    private LocalDate fechaRegistro;

    @Column(nullable = false, length = 30)
    private String estado;

    public ParticipacionJugadorTorneo() {}

    public Integer getIdParticipacionJugadorTorneo() { return idParticipacionJugadorTorneo; }
    public void setIdParticipacionJugadorTorneo(Integer idParticipacionJugadorTorneo) { this.idParticipacionJugadorTorneo = idParticipacionJugadorTorneo; }

    public Torneo getTorneo() { return torneo; }
    public void setTorneo(Torneo torneo) { this.torneo = torneo; }

    public Equipo getEquipo() { return equipo; }
    public void setEquipo(Equipo equipo) { this.equipo = equipo; }

    public Jugador getJugador() { return jugador; }
    public void setJugador(Jugador jugador) { this.jugador = jugador; }

    public Integer getNumeroCamiseta() { return numeroCamiseta; }
    public void setNumeroCamiseta(Integer numeroCamiseta) { this.numeroCamiseta = numeroCamiseta; }

    public LocalDate getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(LocalDate fechaRegistro) { this.fechaRegistro = fechaRegistro; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

}
