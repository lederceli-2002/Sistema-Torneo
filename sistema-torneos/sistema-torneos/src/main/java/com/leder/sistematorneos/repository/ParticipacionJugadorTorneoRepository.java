package com.leder.sistematorneos.repository;

import com.leder.sistematorneos.entity.ParticipacionJugadorTorneo;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParticipacionJugadorTorneoRepository
        extends JpaRepository<ParticipacionJugadorTorneo, Integer> {

    // ¿El equipo tiene jugadores inscritos en ese torneo?
    boolean existsByTorneo_IdTorneoAndEquipo_IdEquipo(Integer idTorneo, Integer idEquipo);

    // Jugadores inscritos en un torneo, ordenados por equipo y camiseta
    // EntityGraph: trae equipo y jugador en la misma consulta (evita una consulta por cada fila)
    @EntityGraph(attributePaths = {"equipo", "jugador"})
    List<ParticipacionJugadorTorneo> findByTorneo_IdTorneoOrderByEquipo_NombreAscNumeroCamisetaAsc(Integer idTorneo);

    // Regla: un jugador no puede inscribirse dos veces en el mismo torneo
    boolean existsByTorneo_IdTorneoAndJugador_IdJugador(Integer idTorneo, Integer idJugador);

    // Regla: el numero de camiseta no se repite dentro del mismo equipo en el torneo
    boolean existsByTorneo_IdTorneoAndEquipo_IdEquipoAndNumeroCamiseta(Integer idTorneo, Integer idEquipo, Integer numeroCamiseta);
}
