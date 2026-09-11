package com.leder.sistematorneos.service;

import com.leder.sistematorneos.entity.Serie;

import java.util.List;

public interface SerieService {

    Serie registrarSerie(Serie serie);

    Serie consultarSerie(int id);

    List<Serie> listarSeries();

    Serie modificarSerie(Serie serie);

    boolean eliminarSerie(int id);
}
