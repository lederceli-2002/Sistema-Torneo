package com.leder.sistematorneos.controller;

import com.leder.sistematorneos.DTO.PartidoResponseDTO;
import com.leder.sistematorneos.entity.Partido;
import com.leder.sistematorneos.service.PartidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.leder.sistematorneos.dto.RegistroPartidoRequestDTO;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/partidos")
@CrossOrigin(origins = "*")
public class PartidoController {

    @Autowired
    private PartidoService partidoService;

    @GetMapping("/{id}")
    public ResponseEntity<Partido> obtenerPartidoPorId(@PathVariable Integer id) {
        Partido partido = partidoService.obtenerPorId(id);
        return ResponseEntity.ok(partido);
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

            return new PartidoResponseDTO(
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