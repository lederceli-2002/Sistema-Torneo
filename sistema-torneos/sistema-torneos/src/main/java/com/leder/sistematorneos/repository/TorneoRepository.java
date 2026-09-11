// TorneoRepository.java
package com.leder.sistematorneos.repository;

import com.leder.sistematorneos.entity.Torneo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TorneoRepository extends JpaRepository<Torneo, Integer> {
}