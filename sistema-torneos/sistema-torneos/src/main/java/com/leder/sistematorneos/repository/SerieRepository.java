package com.leder.sistematorneos.repository;

import com.leder.sistematorneos.entity.Serie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SerieRepository extends JpaRepository<Serie, Integer> {

    // Series de una fase ordenadas
    List<Serie> findByFase_IdFaseOrderByOrdenAsc(Integer idFase);

    // Todas las series de un torneo (de todas sus fases)
    List<Serie> findByFase_Torneo_IdTorneoOrderByFase_OrdenAscOrdenAsc(Integer idTorneo);

    // ¿La fase tiene series? (para no eliminarla)
    boolean existsByFase_IdFase(Integer idFase);

    // Para no repetir el nombre de una serie dentro de la misma fase
    boolean existsByFase_IdFaseAndNombreIgnoreCase(Integer idFase, String nombre);

    boolean existsByFase_IdFaseAndNombreIgnoreCaseAndIdSerieNot(Integer idFase, String nombre, Integer idSerie);
}