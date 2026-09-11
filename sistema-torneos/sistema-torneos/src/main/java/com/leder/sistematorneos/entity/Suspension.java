package com.leder.sistematorneos.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "Suspension")
public class Suspension {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idSuspension;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idParticipacionJugadorTorneo", nullable = false)
    private ParticipacionJugadorTorneo participacionJugadorTorneo;

    @Column(nullable = false, length = 30)
    private String tipo;

    private LocalDate inicioSuspension;

    @Column(nullable = false)
    private Integer cantidadJornadas;

    @Column(nullable = false)
    private Integer jornadasCumplidas;

    @Column(nullable = false, length = 30)
    private String estado;

    @Column(length = 500)
    private String observaciones;

    public Suspension() {}

    public Integer getIdSuspension() { return idSuspension; }
    public void setIdSuspension(Integer idSuspension) { this.idSuspension = idSuspension; }

    public ParticipacionJugadorTorneo getParticipacionJugadorTorneo() { return participacionJugadorTorneo; }
    public void setParticipacionJugadorTorneo(ParticipacionJugadorTorneo participacionJugadorTorneo) { this.participacionJugadorTorneo = participacionJugadorTorneo; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public LocalDate getInicioSuspension() { return inicioSuspension; }
    public void setInicioSuspension(LocalDate inicioSuspension) { this.inicioSuspension = inicioSuspension; }

    public Integer getCantidadJornadas() { return cantidadJornadas; }
    public void setCantidadJornadas(Integer cantidadJornadas) { this.cantidadJornadas = cantidadJornadas; }

    public Integer getJornadasCumplidas() { return jornadasCumplidas; }
    public void setJornadasCumplidas(Integer jornadasCumplidas) { this.jornadasCumplidas = jornadasCumplidas; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }

}
