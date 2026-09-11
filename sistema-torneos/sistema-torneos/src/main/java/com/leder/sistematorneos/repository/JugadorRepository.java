// JugadorRepository.java
package com.leder.sistematorneos.repository;

import com.leder.sistematorneos.entity.Jugador;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JugadorRepository extends JpaRepository<Jugador, Integer> {
}