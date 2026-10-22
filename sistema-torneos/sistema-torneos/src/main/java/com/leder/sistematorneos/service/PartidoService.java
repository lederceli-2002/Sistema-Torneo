package com.leder.sistematorneos.service;
import com.leder.sistematorneos.dto.RegistroPartidoRequestDTO;
import com.leder.sistematorneos.entity.Partido;
import java.util.List;

public interface PartidoService {

    List<Partido> obtenerPartidosPorTorneo(Integer idTorneo);

    Partido obtenerPorId(Integer idPartido); // Conservar solo esta declaración

    Partido guardarPartido(Partido partido);

    void registrarResultadoPartido( RegistroPartidoRequestDTO dto);
    void recalcularRankingJornada(Integer idJornada);
}