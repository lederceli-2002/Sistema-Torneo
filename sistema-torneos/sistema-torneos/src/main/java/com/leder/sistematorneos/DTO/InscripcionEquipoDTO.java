package com.leder.sistematorneos.DTO;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

// Inscripción de un equipo en una serie de un torneo (tabla participacion_equipo_torneo).
// Para inscribir solo se envían idSerie e idEquipo; el resto lo completa el backend.
public class InscripcionEquipoDTO {

    private Integer idInscripcion;

    private Integer idTorneo;

    @NotNull(message = "La serie es obligatoria")
    private Integer idSerie;

    @NotNull(message = "El equipo es obligatorio")
    private Integer idEquipo;

    // Datos de solo lectura para mostrar en pantalla
    private String nombreEquipo;
    private String ciudad;
    private String estado;

    @Size(max = 500, message = "Las observaciones no deben superar 500 caracteres")
    private String observaciones;

    public InscripcionEquipoDTO() {}

    public Integer getIdInscripcion() { return idInscripcion; }
    public void setIdInscripcion(Integer idInscripcion) { this.idInscripcion = idInscripcion; }

    public Integer getIdTorneo() { return idTorneo; }
    public void setIdTorneo(Integer idTorneo) { this.idTorneo = idTorneo; }

    public Integer getIdSerie() { return idSerie; }
    public void setIdSerie(Integer idSerie) { this.idSerie = idSerie; }

    public Integer getIdEquipo() { return idEquipo; }
    public void setIdEquipo(Integer idEquipo) { this.idEquipo = idEquipo; }

    public String getNombreEquipo() { return nombreEquipo; }
    public void setNombreEquipo(String nombreEquipo) { this.nombreEquipo = nombreEquipo; }

    public String getCiudad() { return ciudad; }
    public void setCiudad(String ciudad) { this.ciudad = ciudad; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
}
