package com.leder.sistematorneos.service.IMP;

import com.leder.sistematorneos.dto.RegistroPartidoRequestDTO;
import com.leder.sistematorneos.entity.Gol;
import com.leder.sistematorneos.entity.ParticipacionJugadorTorneo;
import com.leder.sistematorneos.entity.Partido;
import com.leder.sistematorneos.entity.Tarjeta;
import com.leder.sistematorneos.exception.RecursoNoEncontradoException;
import com.leder.sistematorneos.repository.*;
import com.leder.sistematorneos.service.PartidoService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.leder.sistematorneos.entity.RankingJornada;
import com.leder.sistematorneos.entity.ParticipacionEquipoTorneo;

import java.util.*;

import com.leder.sistematorneos.repository.RankingJornadaRepository;
import com.leder.sistematorneos.repository.GolRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PartidoServiceIMP implements PartidoService {

    @Autowired
    private GolRepository golRepository;

    @Autowired
    private RankingJornadaRepository rankingJornadaRepository;

    @Autowired
    private PartidoRepository partidoRepository;

    @Autowired
    private TarjetaRepository tarjetaRepository;

    @Autowired
    private ParticipacionJugadorTorneoRepository participacionJugadorTorneoRepository;

    @Override
    public Partido obtenerPorId(Integer id) {
        return partidoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Partido no encontrado con id: " + id));
    }

    @Override
    public List<Partido> obtenerPartidosPorTorneo(Integer idTorneo) {
        return partidoRepository.findByTorneoId(idTorneo);
    }

    @Override
    public Partido guardarPartido(Partido partido) {
        return partidoRepository.save(partido);
    }

    @Transactional
    @Override
    public void registrarResultadoPartido(RegistroPartidoRequestDTO dto) {
        // 1. Validar existencia del encuentro
        Partido partido = partidoRepository.findById(dto.getIdPartido())
                .orElseThrow(() -> new RecursoNoEncontradoException("Partido no encontrado con id: " + dto.getIdPartido()));

        // 2. Limpiar incidencias anteriores si se está editando un partido previamente registrado
        List<Gol> golesAnteriores = golRepository.findByPartido_IdPartido(partido.getIdPartido());
        if (!golesAnteriores.isEmpty()) {
            golRepository.deleteAll(golesAnteriores);
        }

        // 3. Procesar incidencias (Goles y Tarjetas de la planilla)
        if (dto.getIncidencias() != null && !dto.getIncidencias().isEmpty()) {
            for (RegistroPartidoRequestDTO.IncidenciaDTO inc : dto.getIncidencias()) {
                if (inc.getIdJugador() == null) continue;

                // Obtener la ficha del jugador en el torneo
                ParticipacionJugadorTorneo pjt = participacionJugadorTorneoRepository
                        .findById(inc.getIdJugador())
                        .orElseThrow(() -> new RecursoNoEncontradoException("Jugador no registrado en la participación del torneo con id: " + inc.getIdJugador()));

                if ("Gol".equalsIgnoreCase(inc.getTipoEvento())) {
                    Gol gol = new Gol();
                    gol.setPartido(partido);
                    gol.setParticipacionJugadorTorneo(pjt);
                    gol.setMinuto(inc.getMinuto() != null ? inc.getMinuto() : 0);
                    gol.setTipo("Normal");
                    golRepository.save(gol);
                } else if (inc.getTipoEvento() != null && inc.getTipoEvento().contains("Tarjeta")) {
                    Tarjeta tarjeta = new Tarjeta();
                    tarjeta.setPartido(partido);
                    tarjeta.setParticipacionJugadorTorneo(pjt);
                    tarjeta.setMinuto(inc.getMinuto() != null ? inc.getMinuto() : 0);
                    tarjeta.setTipo(inc.getTipoEvento().contains("Amarilla") ? "Amarilla" : "Roja");
                    tarjetaRepository.save(tarjeta);
                }
            }
        }

        // 4. Actualizar estado a "FINALIZADO" (en mayúsculas consistente)
        partido.setEstado("FINALIZADO");
        partidoRepository.save(partido);

        // 5. Recalcular automáticamente el ranking de la jornada
        if (partido.getJornada() != null) {
            recalcularRankingJornada(partido.getJornada().getIdJornada());
        }
    }

    @Override
    public void recalcularRankingJornada(Integer idJornada) {
        if (idJornada == null) {
            System.out.println("❌ recalcularRankingJornada: idJornada es nulo");
            return;
        }

        // 1. Obtener los partidos de la jornada
        List<Partido> partidosJornada = partidoRepository.findByJornada_IdJornada(idJornada);

        if (partidosJornada == null || partidosJornada.isEmpty()) {
            System.out.println("⚠️ No se encontraron partidos para idJornada = " + idJornada);
            return;
        }

        // 2. Filtrar los partidos que estén FINALIZADOS (ignorando mayúsculas/minúsculas y espacios)
        List<Partido> partidosFinalizados = partidosJornada.stream()
                .filter(p -> p.getEstado() != null && p.getEstado().trim().equalsIgnoreCase("FINALIZADO"))
                .collect(Collectors.toList());

        if (partidosFinalizados.isEmpty()) {
            System.out.println("⚠️ No hay partidos finalizados en la jornada = " + idJornada);
            return;
        }

        Map<Integer, RankingJornada> rankingMap = new HashMap<>();

        for (Partido partido : partidosFinalizados) {
            ParticipacionEquipoTorneo local = partido.getEquipoLocal();
            ParticipacionEquipoTorneo visitante = partido.getEquipoVisitante();

            if (local == null || visitante == null) continue;

            // Consultar los goles del encuentro
            List<Gol> golesPartido = golRepository.findByPartido_IdPartido(partido.getIdPartido());

            int golesLocal = 0;
            int golesVisitante = 0;

            if (golesPartido != null) {
                for (Gol g : golesPartido) {
                    if (g.getParticipacionJugadorTorneo() != null && g.getParticipacionJugadorTorneo().getEquipo() != null) {
                        Integer idEquipoAnotador = g.getParticipacionJugadorTorneo().getEquipo().getIdEquipo();

                        if (local.getEquipo() != null && idEquipoAnotador.equals(local.getEquipo().getIdEquipo())) {
                            golesLocal++;
                        } else if (visitante.getEquipo() != null && idEquipoAnotador.equals(visitante.getEquipo().getIdEquipo())) {
                            golesVisitante++;
                        }
                    }
                }
            }

            // Crear/obtener acumulado Local
            RankingJornada rLocal = rankingMap.computeIfAbsent(local.getIdParticipacionEquipoTorneo(), id -> {
                RankingJornada r = new RankingJornada();
                r.setJornada(partido.getJornada());
                r.setSerie(partido.getJornada() != null ? partido.getJornada().getSerie() : null);
                r.setParticipacionEquipoTorneo(local);
                r.setPartidosJugados(0); r.setGanados(0); r.setEmpatados(0); r.setPerdidos(0);
                r.setGolesFavor(0); r.setGolesContra(0); r.setDiferenciaGoles(0); r.setPuntos(0); r.setPosicion(0);
                return r;
            });

            // Crear/obtener acumulado Visitante
            RankingJornada rVisitante = rankingMap.computeIfAbsent(visitante.getIdParticipacionEquipoTorneo(), id -> {
                RankingJornada r = new RankingJornada();
                r.setJornada(partido.getJornada());
                r.setSerie(partido.getJornada() != null ? partido.getJornada().getSerie() : null);
                r.setParticipacionEquipoTorneo(visitante);
                r.setPartidosJugados(0); r.setGanados(0); r.setEmpatados(0); r.setPerdidos(0);
                r.setGolesFavor(0); r.setGolesContra(0); r.setDiferenciaGoles(0); r.setPuntos(0); r.setPosicion(0);
                return r;
            });

            // Sumar PJ y Goles
            rLocal.setPartidosJugados(rLocal.getPartidosJugados() + 1);
            rVisitante.setPartidosJugados(rVisitante.getPartidosJugados() + 1);

            rLocal.setGolesFavor(rLocal.getGolesFavor() + golesLocal);
            rLocal.setGolesContra(rLocal.getGolesContra() + golesVisitante);

            rVisitante.setGolesFavor(rVisitante.getGolesFavor() + golesVisitante);
            rVisitante.setGolesContra(rVisitante.getGolesContra() + golesLocal);

            // Puntos y resultados
            if (golesLocal > golesVisitante) {
                rLocal.setGanados(rLocal.getGanados() + 1);
                rLocal.setPuntos(rLocal.getPuntos() + 3);
                rVisitante.setPerdidos(rVisitante.getPerdidos() + 1);
            } else if (golesVisitante > golesLocal) {
                rVisitante.setGanados(rVisitante.getGanados() + 1);
                rVisitante.setPuntos(rVisitante.getPuntos() + 3);
                rLocal.setPerdidos(rLocal.getPerdidos() + 1);
            } else {
                rLocal.setEmpatados(rLocal.getEmpatados() + 1);
                rLocal.setPuntos(rLocal.getPuntos() + 1);
                rVisitante.setEmpatados(rVisitante.getEmpatados() + 1);
                rVisitante.setPuntos(rVisitante.getPuntos() + 1);
            }

            rLocal.setDiferenciaGoles(rLocal.getGolesFavor() - rLocal.getGolesContra());
            rVisitante.setDiferenciaGoles(rVisitante.getGolesFavor() - rVisitante.getGolesContra());
        }

        // Ordenar y asignar Posición
        List<RankingJornada> listaRanking = new ArrayList<>(rankingMap.values());
        listaRanking.sort((a, b) -> {
            int cmp = b.getPuntos().compareTo(a.getPuntos());
            if (cmp != 0) return cmp;
            return b.getDiferenciaGoles().compareTo(a.getDiferenciaGoles());
        });

        for (int i = 0; i < listaRanking.size(); i++) {
            listaRanking.get(i).setPosicion(i + 1);
        }

        // Reemplazar anteriores por la nueva lista
        List<RankingJornada> anteriores = rankingJornadaRepository.findByJornada_IdJornadaOrderByPuntosDescDiferenciaGolesDesc(idJornada);
        if (anteriores != null && !anteriores.isEmpty()) {
            rankingJornadaRepository.deleteAll(anteriores);
        }

        rankingJornadaRepository.saveAll(listaRanking);
        System.out.println("✅ Ranking guardado con éxito para idJornada = " + idJornada + " (" + listaRanking.size() + " registros)");
    }
}