package com.leder.sistematorneos.service;

import com.leder.sistematorneos.DTO.SerieDTO;

import java.util.List;

public interface SerieService {

    List<SerieDTO> listarPorFase(int idFase);

    List<SerieDTO> listarPorTorneo(int idTorneo);

    SerieDTO consultarSerie(int id);

    SerieDTO registrarSerie(SerieDTO serie);

    SerieDTO modificarSerie(SerieDTO serie);

    boolean eliminarSerie(int id);
}