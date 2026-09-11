// JornadaRepository.java
package com.leder.sistematorneos.repository;

import com.leder.sistematorneos.entity.Jornada;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JornadaRepository extends JpaRepository<Jornada, Integer> {
}