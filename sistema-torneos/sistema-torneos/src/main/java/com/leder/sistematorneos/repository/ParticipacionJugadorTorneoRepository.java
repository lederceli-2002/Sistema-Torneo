// ParticipacionJugadorTorneoRepository.java
package com.leder.sistematorneos.repository;

import com.leder.sistematorneos.entity.ParticipacionJugadorTorneo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParticipacionJugadorTorneoRepository
        extends JpaRepository<ParticipacionJugadorTorneo, Integer> {
}