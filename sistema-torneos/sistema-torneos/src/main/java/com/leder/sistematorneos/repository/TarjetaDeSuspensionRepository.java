// TarjetaDeSuspensionRepository.java
package com.leder.sistematorneos.repository;

import com.leder.sistematorneos.entity.TarjetaDeSuspension;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TarjetaDeSuspensionRepository
        extends JpaRepository<TarjetaDeSuspension, Integer> {
}