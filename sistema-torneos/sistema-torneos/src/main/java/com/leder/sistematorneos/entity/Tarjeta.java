package com.leder.sistematorneos.entity;

import jakarta.persistence.*;


@Entity
@Table(name = "Tarjeta")
public class Tarjeta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idTarjeta;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idPartido", nullable = false)
    private Partido partido;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idParticipacionJugadorTorneo", nullable = false)
    private ParticipacionJugadorTorneo participacionJugadorTorneo;

    @Column(nullable = false, length = 20)
    private String tipo;

    private Integer minuto;

    @Column(length = 500)
    private String observaciones;

    public Tarjeta() {}

    public Integer getIdTarjeta() { return idTarjeta; }
    public void setIdTarjeta(Integer idTarjeta) { this.idTarjeta = idTarjeta; }

    public Partido getPartido() { return partido; }
    public void setPartido(Partido partido) { this.partido = partido; }

    public ParticipacionJugadorTorneo getParticipacionJugadorTorneo() { return participacionJugadorTorneo; }
    public void setParticipacionJugadorTorneo(ParticipacionJugadorTorneo participacionJugadorTorneo) { this.participacionJugadorTorneo = participacionJugadorTorneo; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public Integer getMinuto() { return minuto; }
    public void setMinuto(Integer minuto) { this.minuto = minuto; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }

}
