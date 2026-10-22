package com.leder.sistematorneos.DTO;

import java.time.LocalDate;

public class PartidoResponseDTO {

    private Integer idJornada;
    private Integer idPartido;


    private String local;
    private String visitante;
    private LocalDate fechaJuego;
    private String estado;
    private String serie;
    private Integer numeroJornada;

    // Constructor completo
    public PartidoResponseDTO(Integer idJornada, Integer idPartido, String local, String visitante, LocalDate fechaJuego, String estado, String serie, Integer numeroJornada) {
        this.idJornada = idJornada;
        this.idPartido = idPartido;
        this.local = local;
        this.visitante = visitante;
        this.fechaJuego = fechaJuego;
        this.estado = estado;
        this.serie = serie;
        this.numeroJornada = numeroJornada;
    }

    // Getters y Setters
    public Integer getIdPartido() {
        return idPartido;
    }

    public void setIdPartido(Integer idPartido) {
        this.idPartido = idPartido;
    }

    public String getLocal() {
        return local;
    }

    public void setLocal(String local) {
        this.local = local;
    }

    public String getVisitante() {
        return visitante;
    }

    public void setVisitante(String visitante) {
        this.visitante = visitante;
    }

    public LocalDate getFechaJuego() {
        return fechaJuego;
    }

    public void setFechaJuego(LocalDate fechaJuego) {
        this.fechaJuego = fechaJuego;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getSerie() {
        return serie;
    }

    public void setSerie(String serie) {
        this.serie = serie;
    }

    public Integer getNumeroJornada() {
        return numeroJornada;
    }

    public void setNumeroJornada(Integer numeroJornada) {
        this.numeroJornada = numeroJornada;
    }
    public Integer getIdJornada() {
        return idJornada;
    }

    public void setIdJornada(Integer idJornada) {
        this.idJornada = idJornada;
    }

}