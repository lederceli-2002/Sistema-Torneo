package com.leder.sistematorneos.repository;

import com.leder.sistematorneos.entity.Jornada;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JornadaRepository extends JpaRepository<Jornada, Integer> {

    // ¿La serie ya tiene jornadas (fixture generado)?
    boolean existsBySerie_IdSerie(Integer idSerie);
}