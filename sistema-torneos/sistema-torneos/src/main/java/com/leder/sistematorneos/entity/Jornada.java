package com.leder.sistematorneos.entity;

import jakarta.persistence.*;


@Entity
@Table(name = "Jornada")
public class Jornada {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idJornada;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idSerie", nullable = false)
    private Serie serie;

    @Column(nullable = false)
    private Integer numero;

    @Column(length = 100)
    private String nombre;

    public Jornada() {}

    public Integer getIdJornada() { return idJornada; }
    public void setIdJornada(Integer idJornada) { this.idJornada = idJornada; }

    public Serie getSerie() { return serie; }
    public void setSerie(Serie serie) { this.serie = serie; }

    public Integer getNumero() { return numero; }
    public void setNumero(Integer numero) { this.numero = numero; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

}
