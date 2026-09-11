// RankingJornadaRepository.java
package com.leder.sistematorneos.repository;

import com.leder.sistematorneos.entity.RankingJornada;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RankingJornadaRepository
        extends JpaRepository<RankingJornada, Integer> {
}