package com.leder.sistematorneos.repository;

import com.leder.sistematorneos.entity.Fase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FaseRepository extends JpaRepository<Fase, Integer> {

    // Fases de un torneo ordenadas (1, 2, 3...)
    List<Fase> findByTorneo_IdTorneoOrderByOrdenAsc(Integer idTorneo);

    // Para no repetir el nombre de una fase dentro del mismo torneo
    boolean existsByTorneo_IdTorneoAndNombreIgnoreCase(Integer idTorneo, String nombre);

    boolean existsByTorneo_IdTorneoAndNombreIgnoreCaseAndIdFaseNot(Integer idTorneo, String nombre, Integer idFase);
}