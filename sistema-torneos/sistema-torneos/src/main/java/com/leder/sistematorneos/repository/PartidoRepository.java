// PartidoRepository.java
package com.leder.sistematorneos.repository;

import com.leder.sistematorneos.entity.Partido;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PartidoRepository extends JpaRepository<Partido, Integer> {
}