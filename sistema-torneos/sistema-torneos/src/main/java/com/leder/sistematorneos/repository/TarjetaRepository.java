// TarjetaRepository.java
package com.leder.sistematorneos.repository;

import com.leder.sistematorneos.entity.Tarjeta;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TarjetaRepository extends JpaRepository<Tarjeta, Integer> {
}