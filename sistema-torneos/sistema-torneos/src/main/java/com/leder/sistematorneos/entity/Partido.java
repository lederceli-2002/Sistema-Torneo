package com.leder.sistematorneos.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "Partido")
public class Partido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idPartido;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idJornada", nullable = false)
    private Jornada jornada;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idEquipoLocal", nullable = false)
    private ParticipacionEquipoTorneo equipoLocal;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idEquipoVisitante", nullable = false)
    private ParticipacionEquipoTorneo equipoVisitante;

    private LocalDate fechaJuego;

    private LocalTime horaInicio;

    private LocalTime horaFin;

    @Column(nullable = false, length = 30)
    private String estado;

    @Column(length = 500)
    private String observaciones;

    public Partido() {}

    public Integer getIdPartido() { return idPartido; }
    public void setIdPartido(Integer idPartido) { this.idPartido = idPartido; }

    public Jornada getJornada() { return jornada; }
    public void setJornada(Jornada jornada) { this.jornada = jornada; }

    public ParticipacionEquipoTorneo getEquipoLocal() { return equipoLocal; }
    public void setEquipoLocal(ParticipacionEquipoTorneo equipoLocal) { this.equipoLocal = equipoLocal; }

    public ParticipacionEquipoTorneo getEquipoVisitante() { return equipoVisitante; }
    public void setEquipoVisitante(ParticipacionEquipoTorneo equipoVisitante) { this.equipoVisitante = equipoVisitante; }

    public LocalDate getFechaJuego() { return fechaJuego; }
    public void setFechaJuego(LocalDate fechaJuego) { this.fechaJuego = fechaJuego; }

    public LocalTime getHoraInicio() { return horaInicio; }
    public void setHoraInicio(LocalTime horaInicio) { this.horaInicio = horaInicio; }

    public LocalTime getHoraFin() { return horaFin; }
    public void setHoraFin(LocalTime horaFin) { this.horaFin = horaFin; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }

}
