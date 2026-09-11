package com.leder.sistematorneos.entity;

import jakarta.persistence.*;


@Entity
@Table(name = "RankingJornada")
public class RankingJornada {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idRankingJornada;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idSerie", nullable = false)
    private Serie serie;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idJornada", nullable = false)
    private Jornada jornada;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idParticipacionEquipoTorneo", nullable = false)
    private ParticipacionEquipoTorneo participacionEquipoTorneo;

    @Column(nullable = false)
    private Integer partidosJugados;

    @Column(nullable = false)
    private Integer ganados;

    @Column(nullable = false)
    private Integer empatados;

    @Column(nullable = false)
    private Integer perdidos;

    @Column(nullable = false)
    private Integer golesFavor;

    @Column(nullable = false)
    private Integer golesContra;

    @Column(nullable = false)
    private Integer diferenciaGoles;

    @Column(nullable = false)
    private Integer puntos;

    @Column(nullable = false)
    private Integer posicion;

    public RankingJornada() {}

    public Integer getIdRankingJornada() { return idRankingJornada; }
    public void setIdRankingJornada(Integer idRankingJornada) { this.idRankingJornada = idRankingJornada; }

    public Serie getSerie() { return serie; }
    public void setSerie(Serie serie) { this.serie = serie; }

    public Jornada getJornada() { return jornada; }
    public void setJornada(Jornada jornada) { this.jornada = jornada; }

    public ParticipacionEquipoTorneo getParticipacionEquipoTorneo() { return participacionEquipoTorneo; }
    public void setParticipacionEquipoTorneo(ParticipacionEquipoTorneo participacionEquipoTorneo) { this.participacionEquipoTorneo = participacionEquipoTorneo; }

    public Integer getPartidosJugados() { return partidosJugados; }
    public void setPartidosJugados(Integer partidosJugados) { this.partidosJugados = partidosJugados; }

    public Integer getGanados() { return ganados; }
    public void setGanados(Integer ganados) { this.ganados = ganados; }

    public Integer getEmpatados() { return empatados; }
    public void setEmpatados(Integer empatados) { this.empatados = empatados; }

    public Integer getPerdidos() { return perdidos; }
    public void setPerdidos(Integer perdidos) { this.perdidos = perdidos; }

    public Integer getGolesFavor() { return golesFavor; }
    public void setGolesFavor(Integer golesFavor) { this.golesFavor = golesFavor; }

    public Integer getGolesContra() { return golesContra; }
    public void setGolesContra(Integer golesContra) { this.golesContra = golesContra; }

    public Integer getDiferenciaGoles() { return diferenciaGoles; }
    public void setDiferenciaGoles(Integer diferenciaGoles) { this.diferenciaGoles = diferenciaGoles; }

    public Integer getPuntos() { return puntos; }
    public void setPuntos(Integer puntos) { this.puntos = puntos; }

    public Integer getPosicion() { return posicion; }
    public void setPosicion(Integer posicion) { this.posicion = posicion; }

}
