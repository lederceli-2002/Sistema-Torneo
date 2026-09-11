// ParticipacionEquipoTorneoRepository.java
package com.leder.sistematorneos.repository;

import com.leder.sistematorneos.entity.ParticipacionEquipoTorneo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParticipacionEquipoTorneoRepository
        extends JpaRepository<ParticipacionEquipoTorneo, Integer> {
}