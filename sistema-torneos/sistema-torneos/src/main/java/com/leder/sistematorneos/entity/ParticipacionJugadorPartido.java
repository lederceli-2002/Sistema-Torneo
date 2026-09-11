package com.leder.sistematorneos.entity;

import jakarta.persistence.*;


@Entity
@Table(name = "ParticipacionJugadorPartido")
public class ParticipacionJugadorPartido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idParticipacionJugadorPartido;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idParticipacionJugadorTorneo", nullable = false)
    private ParticipacionJugadorTorneo participacionJugadorTorneo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idPartido", nullable = false)
    private Partido partido;

    @Column(nullable = false, length = 20)
    private String tipoParticipacion;

    private Integer minutosJugados;

    public ParticipacionJugadorPartido() {}

    public Integer getIdParticipacionJugadorPartido() { return idParticipacionJugadorPartido; }
    public void setIdParticipacionJugadorPartido(Integer idParticipacionJugadorPartido) { this.idParticipacionJugadorPartido = idParticipacionJugadorPartido; }

    public ParticipacionJugadorTorneo getParticipacionJugadorTorneo() { return participacionJugadorTorneo; }
    public void setParticipacionJugadorTorneo(ParticipacionJugadorTorneo participacionJugadorTorneo) { this.participacionJugadorTorneo = participacionJugadorTorneo; }

    public Partido getPartido() { return partido; }
    public void setPartido(Partido partido) { this.partido = partido; }

    public String getTipoParticipacion() { return tipoParticipacion; }
    public void setTipoParticipacion(String tipoParticipacion) { this.tipoParticipacion = tipoParticipacion; }

    public Integer getMinutosJugados() { return minutosJugados; }
    public void setMinutosJugados(Integer minutosJugados) { this.minutosJugados = minutosJugados; }

}
