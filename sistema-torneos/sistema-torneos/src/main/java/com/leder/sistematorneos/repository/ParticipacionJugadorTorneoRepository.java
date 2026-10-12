package com.leder.sistematorneos.repository;

import com.leder.sistematorneos.entity.ParticipacionJugadorTorneo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParticipacionJugadorTorneoRepository
        extends JpaRepository<ParticipacionJugadorTorneo, Integer> {

    // ¿El equipo tiene jugadores inscritos en ese torneo?
    boolean existsByTorneo_IdTorneoAndEquipo_IdEquipo(Integer idTorneo, Integer idEquipo);
}
