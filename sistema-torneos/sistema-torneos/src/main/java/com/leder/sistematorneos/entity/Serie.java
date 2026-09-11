package com.leder.sistematorneos.entity;

import jakarta.persistence.*;


@Entity
@Table(name = "Serie")
public class Serie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idSerie;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idFase", nullable = false)
    private Fase fase;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(length = 500)
    private String descripcion;

    @Column(nullable = false)
    private Integer orden;

    public Serie() {}

    public Integer getIdSerie() { return idSerie; }
    public void setIdSerie(Integer idSerie) { this.idSerie = idSerie; }

    public Fase getFase() { return fase; }
    public void setFase(Fase fase) { this.fase = fase; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Integer getOrden() { return orden; }
    public void setOrden(Integer orden) { this.orden = orden; }

}
