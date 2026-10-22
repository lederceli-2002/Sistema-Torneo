package com.leder.sistematorneos.repository;

import com.leder.sistematorneos.entity.Jugador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JugadorRepository extends JpaRepository<Jugador, Integer> {

    // Consulta SQL nativa que busca los jugadores inscritos para un id_equipo específico
    @Query(value = "SELECT j.* FROM jugador j " +
            "JOIN participacion_jugador_torneo pjt ON j.id_jugador = pjt.id_jugador " +
            "WHERE pjt.id_equipo = :idEquipo", nativeQuery = true)
    List<Jugador> findJugadoresByEquipoId(@Param("idEquipo") int idEquipo);

}