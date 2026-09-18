// TorneoRepository.java
package com.leder.sistematorneos.repository;

import com.leder.sistematorneos.DTO.TorneoDTO;
import com.leder.sistematorneos.entity.Torneo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TorneoRepository extends JpaRepository<Torneo, Integer>,TorneoRepositoryCustom{
}










