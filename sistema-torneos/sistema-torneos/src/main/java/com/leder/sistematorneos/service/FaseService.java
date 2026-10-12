package com.leder.sistematorneos.service;

import com.leder.sistematorneos.DTO.FaseDTO;

import java.util.List;

public interface FaseService {

    List<FaseDTO> listarPorTorneo(int idTorneo);

    FaseDTO consultarFase(int id);

    FaseDTO registrarFase(FaseDTO fase);

    FaseDTO actualizarFase(FaseDTO fase);

    boolean eliminarFase(int id);
}