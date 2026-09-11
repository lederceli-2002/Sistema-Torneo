package com.leder.sistematorneos.service;

import com.leder.sistematorneos.entity.Torneo;

import java.util.List;

public interface TorneoService {

     Torneo registrarTorneo(Torneo torneo);

     Torneo consultarTorneo(int id);

     List<Torneo> listarTorneos();

     Torneo modificarTorneo(Torneo torneo);

     boolean eliminarTorneo(int id);
}
