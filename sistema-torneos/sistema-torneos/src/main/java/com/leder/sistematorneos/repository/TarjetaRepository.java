// TarjetaRepository.java
package com.leder.sistematorneos.repository;

import com.leder.sistematorneos.entity.Tarjeta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TarjetaRepository extends JpaRepository<Tarjeta, Integer> {

    // JOIN FETCH trae las relaciones (Partido, Jugador, Equipos) en 1 sola consulta
    @Query("SELECT DISTINCT t FROM Tarjeta t " +
            "JOIN FETCH t.partido p " +
            "JOIN FETCH p.jornada j " +
            "LEFT JOIN FETCH t.participacionJugadorTorneo pjt " +
            "LEFT JOIN FETCH pjt.jugador jug " +
            "LEFT JOIN FETCH pjt.equipo eq " +
            "WHERE j.idJornada = :idJornada")
    List<Tarjeta> findByPartido_Jornada_IdJornada(@Param("idJornada") Integer idJornada);

    List<Tarjeta> findByPartido_IdPartido(Integer idPartido);
}