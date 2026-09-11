// SerieRepository.java
package com.leder.sistematorneos.repository;

import com.leder.sistematorneos.entity.Serie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SerieRepository extends JpaRepository<Serie, Integer> {
}