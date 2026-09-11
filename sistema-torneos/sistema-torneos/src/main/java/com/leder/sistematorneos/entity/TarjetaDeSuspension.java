package com.leder.sistematorneos.entity;

import jakarta.persistence.*;


@Entity
@Table(name = "TarjetaDeSuspension")
public class TarjetaDeSuspension {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idTarjetaDeSuspension;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idSuspension", nullable = false)
    private Suspension suspension;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idTarjeta", nullable = false)
    private Tarjeta tarjeta;

    public TarjetaDeSuspension() {}

    public Integer getIdTarjetaDeSuspension() { return idTarjetaDeSuspension; }
    public void setIdTarjetaDeSuspension(Integer idTarjetaDeSuspension) { this.idTarjetaDeSuspension = idTarjetaDeSuspension; }

    public Suspension getSuspension() { return suspension; }
    public void setSuspension(Suspension suspension) { this.suspension = suspension; }

    public Tarjeta getTarjeta() { return tarjeta; }
    public void setTarjeta(Tarjeta tarjeta) { this.tarjeta = tarjeta; }

}
