package com.leder.sistematorneos.service;

import com.leder.sistematorneos.DTO.InscripcionJugadorDTO;

import java.util.List;

public interface InscripcionJugadorService {

    List<InscripcionJugadorDTO> listarPorTorneo(int idTorneo);

    InscripcionJugadorDTO inscribirJugador(InscripcionJugadorDTO inscripcion);

    boolean retirarJugador(int idInscripcion);
}
