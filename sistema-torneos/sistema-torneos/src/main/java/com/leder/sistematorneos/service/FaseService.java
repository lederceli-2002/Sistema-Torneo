package com.leder.sistematorneos.service;

import com.leder.sistematorneos.entity.Fase;

import java.util.List;

public interface FaseService {
    Fase registrarFase(Fase fase);
    Fase consultarFase(int id);
    List<Fase> listarFases();
    Fase actualizarFase(Fase fase);
    boolean eliminarFase(int id);
}
