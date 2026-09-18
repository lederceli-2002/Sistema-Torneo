package com.leder.sistematorneos.service;

import com.leder.sistematorneos.DTO.TorneoDTO;
import com.leder.sistematorneos.entity.Torneo;

import java.util.List;

public interface TorneoService {

     List<TorneoDTO> listarTarjeteros();

     Torneo registrarTorneo(Torneo torneo);

     Torneo consultarTorneo(int id);

     List<Torneo> listarTorneos();

     Torneo modificarTorneo(Torneo torneo);

     boolean eliminarTorneo(int id);
}
