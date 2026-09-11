// SuspensionRepository.java
package com.leder.sistematorneos.repository;

import com.leder.sistematorneos.entity.Suspension;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SuspensionRepository extends JpaRepository<Suspension, Integer> {
}