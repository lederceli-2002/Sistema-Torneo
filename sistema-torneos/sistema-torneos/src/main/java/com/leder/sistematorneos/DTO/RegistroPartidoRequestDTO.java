package com.leder.sistematorneos.dto;

import java.util.List;

public class RegistroPartidoRequestDTO {

    private Integer idPartido;
    private Integer golesLocal;
    private Integer golesVisitante;
    private List<IncidenciaDTO> incidencias;

    public static class IncidenciaDTO {
        private String equipo; // "LOCAL" o "VISITANTE"
        private String tipoEvento; // "Gol", "Tarjeta Amarilla", "Tarjeta Roja"
        private Integer idJugador;
        private Integer minuto;

        // Getters y Setters
        public String getEquipo() { return equipo; }
        public void setEquipo(String equipo) { this.equipo = equipo; }
        public String getTipoEvento() { return tipoEvento; }
        public void setTipoEvento(String tipoEvento) { this.tipoEvento = tipoEvento; }
        public Integer getIdJugador() { return idJugador; }
        public void setIdJugador(Integer idJugador) { this.idJugador = idJugador; }
        public Integer getMinuto() { return minuto; }
        public void setMinuto(Integer minuto) { this.minuto = minuto; }
    }

    // Getters y Setters
    public Integer getIdPartido() { return idPartido; }
    public void setIdPartido(Integer idPartido) { this.idPartido = idPartido; }
    public Integer getGolesLocal() { return golesLocal; }
    public void setGolesLocal(Integer golesLocal) { this.golesLocal = golesLocal; }
    public Integer getGolesVisitante() { return golesVisitante; }
    public void setGolesVisitante(Integer golesVisitante) { this.golesVisitante = golesVisitante; }
    public List<IncidenciaDTO> getIncidencias() { return incidencias; }
    public void setIncidencias(List<IncidenciaDTO> incidencias) { this.incidencias = incidencias; }
}