package com.leder.sistematorneos.controller;

import com.leder.sistematorneos.DTO.PartidoResponseDTO;
import com.leder.sistematorneos.entity.Gol;
import com.leder.sistematorneos.entity.Partido;
import com.leder.sistematorneos.entity.Tarjeta;
import com.leder.sistematorneos.repository.GolRepository;
import com.leder.sistematorneos.repository.TarjetaRepository;
import com.leder.sistematorneos.service.PartidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.leder.sistematorneos.dto.RegistroPartidoRequestDTO;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/partidos")
@CrossOrigin(origins = "*")
public class PartidoController {

    @Autowired
    private PartidoService partidoService;

    @Autowired
    private GolRepository golRepository;

    @Autowired
    private TarjetaRepository tarjetaRepository;

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> obtenerPartidoPorId(@PathVariable Integer id) {
        Partido p = partidoService.obtenerPorId(id);

        Map<String, Object> map = new HashMap<>();
        map.put("idPartido", p.getIdPartido());
        map.put("estado", p.getEstado() != null ? p.getEstado() : "PENDIENTE");
        map.put("fechaJuego", p.getFechaJuego());

        String local = (p.getEquipoLocal() != null && p.getEquipoLocal().getEquipo() != null)
                ? p.getEquipoLocal().getEquipo().getNombre() : "Equipo Local";
        String visitante = (p.getEquipoVisitante() != null && p.getEquipoVisitante().getEquipo() != null)
                ? p.getEquipoVisitante().getEquipo().getNombre() : "Equipo Visitante";

        map.put("local", local);
        map.put("visitante", visitante);

        // Contar goles
        List<Gol> goles = golRepository.findByPartido_IdPartido(p.getIdPartido());
        int golesLocal = (int) goles.stream().filter(g ->
                g.getParticipacionJugadorTorneo() != null &&
                        g.getParticipacionJugadorTorneo().getEquipo() != null &&
                        p.getEquipoLocal() != null &&
                        g.getParticipacionJugadorTorneo().getEquipo().getIdEquipo()
                                .equals(p.getEquipoLocal().getEquipo().getIdEquipo())
        ).count();

        int golesVisitante = (int) goles.stream().filter(g ->
                g.getParticipacionJugadorTorneo() != null &&
                        g.getParticipacionJugadorTorneo().getEquipo() != null &&
                        p.getEquipoVisitante() != null &&
                        g.getParticipacionJugadorTorneo().getEquipo().getIdEquipo()
                                .equals(p.getEquipoVisitante().getEquipo().getIdEquipo())
        ).count();

        map.put("golesLocal", golesLocal);
        map.put("golesVisitante", golesVisitante);

        // Cargar Tarjetas registradas en el partido
        List<Tarjeta> tarjetas = tarjetaRepository.findByPartido_IdPartido(p.getIdPartido());
        List<Map<String, Object>> listaTarjetas = tarjetas.stream().map(t -> {
            Map<String, Object> tm = new HashMap<>();
            tm.put("idTarjeta", t.getIdTarjeta());
            tm.put("minuto", t.getMinuto());
            tm.put("tipo", t.getTipo());
            if (t.getParticipacionJugadorTorneo() != null && t.getParticipacionJugadorTorneo().getJugador() != null) {
                tm.put("jugador", t.getParticipacionJugadorTorneo().getJugador().getNombres() + " " + t.getParticipacionJugadorTorneo().getJugador().getApellidos());
                tm.put("idJugador", t.getParticipacionJugadorTorneo().getIdParticipacionJugadorTorneo());
            }
            if (t.getParticipacionJugadorTorneo() != null && t.getParticipacionJugadorTorneo().getEquipo() != null) {
                boolean esLocal = p.getEquipoLocal() != null && t.getParticipacionJugadorTorneo().getEquipo().getIdEquipo().equals(p.getEquipoLocal().getEquipo().getIdEquipo());
                tm.put("equipo", esLocal ? "LOCAL" : "VISITANTE");
            }
            return tm;
        }).collect(Collectors.toList());

        map.put("tarjetas", listaTarjetas);

        if (p.getEquipoLocal() != null) {
            map.put("idEquipoLocal", p.getEquipoLocal().getIdParticipacionEquipoTorneo());
        }
        if (p.getEquipoVisitante() != null) {
            map.put("idEquipoVisitante", p.getEquipoVisitante().getIdParticipacionEquipoTorneo());
        }

        return ResponseEntity.ok(map);
    }

    @GetMapping("/torneo/{idTorneo}")
    public ResponseEntity<List<PartidoResponseDTO>> obtenerPartidosPorTorneo(@PathVariable Integer idTorneo) {
        List<Partido> partidos = partidoService.obtenerPartidosPorTorneo(idTorneo);

        List<PartidoResponseDTO> response = partidos.stream().map(p -> {
            String local = (p.getEquipoLocal() != null && p.getEquipoLocal().getEquipo() != null)
                    ? p.getEquipoLocal().getEquipo().getNombre()
                    : "Equipo Local";

            String visitante = (p.getEquipoVisitante() != null && p.getEquipoVisitante().getEquipo() != null)
                    ? p.getEquipoVisitante().getEquipo().getNombre()
                    : "Equipo Visitante";

            String nombreSerie = (p.getJornada() != null && p.getJornada().getSerie() != null)
                    ? p.getJornada().getSerie().getNombre()
                    : "Serie A";

            Integer numeroJornada = (p.getJornada() != null)
                    ? p.getJornada().getNumero()
                    : 1;
            Integer idJornadaReal = (p.getJornada() != null) ? p.getJornada().getIdJornada() : null;

            return new PartidoResponseDTO(
                    idJornadaReal,
                    p.getIdPartido(),
                    local,
                    visitante,
                    p.getFechaJuego(),
                    p.getEstado() != null ? p.getEstado() : "PENDIENTE",
                    nombreSerie,
                    numeroJornada

            );
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/registrar")
    public ResponseEntity<?> registrarResultado(@RequestBody RegistroPartidoRequestDTO dto) {
        partidoService.registrarResultadoPartido(dto);
        return ResponseEntity.ok(Map.of("message", "Partido finalizado y registrado con éxito"));
    }
}