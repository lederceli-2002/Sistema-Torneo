// GolRepository.java
package com.leder.sistematorneos.repository;

import com.leder.sistematorneos.entity.Gol;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GolRepository extends JpaRepository<Gol, Integer> {
    List<Gol> findByPartido_IdPartido(Integer idPartido);
}