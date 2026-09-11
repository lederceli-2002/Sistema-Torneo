package com.leder.sistematorneos.entity;

import jakarta.persistence.*;


@Entity
@Table(name = "ParticipacionEquipoTorneo")
public class ParticipacionEquipoTorneo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idParticipacionEquipoTorneo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idTorneo", nullable = false)
    private Torneo torneo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idSerie", nullable = false)
    private Serie serie;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idEquipo", nullable = false)
    private Equipo equipo;

    @Column(nullable = false, length = 30)
    private String estado;

    @Column(length = 500)
    private String observaciones;

    public ParticipacionEquipoTorneo() {}

    public Integer getIdParticipacionEquipoTorneo() { return idParticipacionEquipoTorneo; }
    public void setIdParticipacionEquipoTorneo(Integer idParticipacionEquipoTorneo) { this.idParticipacionEquipoTorneo = idParticipacionEquipoTorneo; }

    public Torneo getTorneo() { return torneo; }
    public void setTorneo(Torneo torneo) { this.torneo = torneo; }

    public Serie getSerie() { return serie; }
    public void setSerie(Serie serie) { this.serie = serie; }

    public Equipo getEquipo() { return equipo; }
    public void setEquipo(Equipo equipo) { this.equipo = equipo; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }

}
