package com.leder.sistematorneos.repository;

import com.leder.sistematorneos.entity.ParticipacionJugadorPartido;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParticipacionJugadorPartidoRepository
        extends JpaRepository<ParticipacionJugadorPartido, Integer> {

    // ¿El jugador ya jugó algún partido con esa inscripción?
    boolean existsByParticipacionJugadorTorneo_IdParticipacionJugadorTorneo(Integer idParticipacionJugadorTorneo);
}
