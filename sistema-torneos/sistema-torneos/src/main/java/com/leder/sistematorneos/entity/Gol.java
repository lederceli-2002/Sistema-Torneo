package com.leder.sistematorneos.entity;

import jakarta.persistence.*;


@Entity
@Table(name = "Gol")
public class Gol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idGol;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idPartido", nullable = false)
    private Partido partido;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idParticipacionJugadorTorneo", nullable = false)
    private ParticipacionJugadorTorneo participacionJugadorTorneo;

    private Integer minuto;

    @Column(length = 30)
    private String tipo;

    public Gol() {}

    public Integer getIdGol() { return idGol; }
    public void setIdGol(Integer idGol) { this.idGol = idGol; }

    public Partido getPartido() { return partido; }
    public void setPartido(Partido partido) { this.partido = partido; }

    public ParticipacionJugadorTorneo getParticipacionJugadorTorneo() { return participacionJugadorTorneo; }
    public void setParticipacionJugadorTorneo(ParticipacionJugadorTorneo participacionJugadorTorneo) { this.participacionJugadorTorneo = participacionJugadorTorneo; }

    public Integer getMinuto() { return minuto; }
    public void setMinuto(Integer minuto) { this.minuto = minuto; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }


}
