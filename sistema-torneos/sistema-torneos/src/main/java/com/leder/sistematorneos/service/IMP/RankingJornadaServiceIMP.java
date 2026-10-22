package com.leder.sistematorneos.service.IMP;

import com.leder.sistematorneos.entity.RankingJornada;
import com.leder.sistematorneos.repository.RankingJornadaRepository;
import com.leder.sistematorneos.service.RankingJornadaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RankingJornadaServiceIMP implements RankingJornadaService {

    @Autowired
    private RankingJornadaRepository rankingJornadaRepository;

    @Override
    public List<Map<String, Object>> obtenerRankingPorJornada(Integer idJornada) {
        if (idJornada == null) {
            return List.of();
        }
        // Llamada al método con @Query que ya existe en tu repositorio
        List<RankingJornada> lista = rankingJornadaRepository.obtenerRankingPorIdJornada(idJornada);
        return mapearRankingAListaLimpia(lista);
    }

    @Override
    public List<Map<String, Object>> obtenerRankingPorTorneoSerieYJornada(Integer idTorneo, String nombreSerie, Integer numeroJornada) {
        if (idTorneo == null || nombreSerie == null || numeroJornada == null) {
            return List.of();
        }
        // Llamada al método JPQL alternativo de tu repositorio
        List<RankingJornada> lista = rankingJornadaRepository.obtenerRankingPorTorneoSerieYJornada(idTorneo, nombreSerie, numeroJornada);
        return mapearRankingAListaLimpia(lista);
    }

    // Método auxiliar para formatear la respuesta a un JSON limpio sin ciclos de Hibernate
    private List<Map<String, Object>> mapearRankingAListaLimpia(List<RankingJornada> lista) {
        List<Map<String, Object>> respuesta = new ArrayList<>();

        for (RankingJornada r : lista) {
            Map<String, Object> map = new HashMap<>();
            map.put("idRankingJornada", r.getIdRankingJornada());
            map.put("posicion", r.getPosicion() != null ? r.getPosicion() : 0);

            // Obtención segura del nombre del equipo
            String equipoNombre = "Equipo";
            if (r.getParticipacionEquipoTorneo() != null &&
                    r.getParticipacionEquipoTorneo().getEquipo() != null) {
                equipoNombre = r.getParticipacionEquipoTorneo().getEquipo().getNombre();
            }

            map.put("equipo", equipoNombre);
            map.put("partidosJugados", r.getPartidosJugados() != null ? r.getPartidosJugados() : 0);
            map.put("ganados", r.getGanados() != null ? r.getGanados() : 0);
            map.put("empatados", r.getEmpatados() != null ? r.getEmpatados() : 0);
            map.put("perdidos", r.getPerdidos() != null ? r.getPerdidos() : 0);
            map.put("golesFavor", r.getGolesFavor() != null ? r.getGolesFavor() : 0);
            map.put("golesContra", r.getGolesContra() != null ? r.getGolesContra() : 0);
            map.put("diferenciaGoles", r.getDiferenciaGoles() != null ? r.getDiferenciaGoles() : 0);
            map.put("puntos", r.getPuntos() != null ? r.getPuntos() : 0);

            respuesta.add(map);
        }

        return respuesta;
    }
}