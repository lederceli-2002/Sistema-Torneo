package com.leder.sistematorneos.repository;

import com.leder.sistematorneos.entity.ParticipacionEquipoTorneo;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParticipacionEquipoTorneoRepository
        extends JpaRepository<ParticipacionEquipoTorneo, Integer> {

    boolean existsByTorneo_IdTorneo(Integer idTorneo);

    // ¿El equipo está inscrito en algún torneo?
    boolean existsByEquipo_IdEquipo(Integer idEquipo);

    // ¿La serie tiene equipos inscritos?
    boolean existsBySerie_IdSerie(Integer idSerie);

    // Equipos inscritos en un torneo, ordenados por nombre
    // EntityGraph: trae equipo y serie en la misma consulta (evita una consulta por cada fila)
    @EntityGraph(attributePaths = {"equipo", "serie"})
    List<ParticipacionEquipoTorneo> findByTorneo_IdTorneoOrderByEquipo_NombreAsc(Integer idTorneo);

    // Regla: un equipo no puede inscribirse dos veces en el mismo torneo
    boolean existsByTorneo_IdTorneoAndEquipo_IdEquipo(Integer idTorneo, Integer idEquipo);
}
