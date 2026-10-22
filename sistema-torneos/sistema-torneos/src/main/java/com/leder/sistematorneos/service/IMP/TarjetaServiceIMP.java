package com.leder.sistematorneos.service.IMP;

import com.leder.sistematorneos.entity.Tarjeta;
import com.leder.sistematorneos.repository.TarjetaRepository;
import com.leder.sistematorneos.service.TarjetaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TarjetaServiceIMP implements TarjetaService {

    @Autowired
    private TarjetaRepository tarjetaRepository;

    @Override
    public List<Map<String, Object>> obtenerTarjetasPorJornada(Integer idJornada) {
        if (idJornada == null) {
            return List.of();
        }

        List<Tarjeta> tarjetas = tarjetaRepository.findByPartido_Jornada_IdJornada(idJornada);
        List<Map<String, Object>> resultado = new ArrayList<>();

        for (Tarjeta t : tarjetas) {
            try {
                Map<String, Object> map = new HashMap<>();
                map.put("idTarjeta", t.getIdTarjeta());
                map.put("minuto", t.getMinuto() != null ? t.getMinuto() : 0);
                map.put("tipo", t.getTipo() != null ? t.getTipo() : "Amarilla");

                // Nombre del enfrentamiento (Equipo Local vs Equipo Visitante)
                String local = "Equipo Local";
                String visitante = "Equipo Visitante";

                if (t.getPartido() != null) {
                    if (t.getPartido().getEquipoLocal() != null && t.getPartido().getEquipoLocal().getEquipo() != null) {
                        local = t.getPartido().getEquipoLocal().getEquipo().getNombre();
                    }
                    if (t.getPartido().getEquipoVisitante() != null && t.getPartido().getEquipoVisitante().getEquipo() != null) {
                        visitante = t.getPartido().getEquipoVisitante().getEquipo().getNombre();
                    }
                }
                map.put("partido", local + " vs " + visitante);

                // Nombre del jugador sancionado
                String jugador = "Jugador Sancionado";
                String equipo = "Equipo";

                if (t.getParticipacionJugadorTorneo() != null) {
                    if (t.getParticipacionJugadorTorneo().getJugador() != null) {
                        jugador = t.getParticipacionJugadorTorneo().getJugador().getNombres() + " " +
                                t.getParticipacionJugadorTorneo().getJugador().getApellidos();
                    }
                    if (t.getParticipacionJugadorTorneo().getEquipo() != null) {
                        equipo = t.getParticipacionJugadorTorneo().getEquipo().getNombre();
                    }
                }

                map.put("jugador", jugador);
                map.put("equipo", equipo);

                resultado.add(map);
            } catch (Exception e) {
                System.err.println("⚠️ Error procesando tarjeta ID " + t.getIdTarjeta() + ": " + e.getMessage());
            }
        }

        return resultado;
    }
}