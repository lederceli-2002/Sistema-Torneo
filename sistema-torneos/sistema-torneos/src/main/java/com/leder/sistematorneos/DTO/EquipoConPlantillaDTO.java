package com.leder.sistematorneos.DTO;

import java.util.List;

public class EquipoConPlantillaDTO {

    private String nombre;
    private String descripcion;
    private String ciudad;
    private String escudo;
    private String estado;
    private List<Integer> idsJugadores; // IDs de los jugadores elegidos para la plantilla base del club

    // Constructor vacío por defecto que asegura "ACTIVO" si no se envía nada
    public EquipoConPlantillaDTO() {
        this.estado = "ACTIVO";
    }

    // Constructor completo
    public EquipoConPlantillaDTO(String nombre, String descripcion, String ciudad, String escudo, String estado, List<Integer> idsJugadores) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.ciudad = ciudad;
        this.escudo = escudo;
        this.estado = (estado != null && !estado.trim().isEmpty()) ? estado : "ACTIVO";
        this.idsJugadores = idsJugadores;
    }

    // Getters y Setters
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getCiudad() {
        return ciudad;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public String getEscudo() {
        return escudo;
    }

    public void setEscudo(String escudo) {
        this.escudo = escudo;
    }

    public String getEstado() {
        // Garantiza que nunca devuelva null al servicio o controlador
        return (estado != null && !estado.trim().isEmpty()) ? estado : "ACTIVO";
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public List<Integer> getIdsJugadores() {
        return idsJugadores;
    }

    public void setIdsJugadores(List<Integer> idsJugadores) {
        this.idsJugadores = idsJugadores;
    }
}