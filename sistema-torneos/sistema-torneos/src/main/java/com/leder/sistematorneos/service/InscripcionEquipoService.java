package com.leder.sistematorneos.service;

import com.leder.sistematorneos.DTO.InscripcionEquipoDTO;

import java.util.List;

public interface InscripcionEquipoService {

    List<InscripcionEquipoDTO> listarPorTorneo(int idTorneo);

    InscripcionEquipoDTO inscribirEquipo(InscripcionEquipoDTO inscripcion);

    boolean retirarEquipo(int idInscripcion);
}
