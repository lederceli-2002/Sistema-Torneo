package com.leder.sistematorneos.repository;

import com.leder.sistematorneos.entity.Partido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PartidoRepository extends JpaRepository<Partido, Integer> {

    @Query("SELECT p FROM Partido p WHERE p.jornada.serie.fase.torneo.idTorneo = :idTorneo")
    List<Partido> findByTorneoId(@Param("idTorneo") Integer idTorneo);

    List<Partido> findByJornada_IdJornadaAndEstado(Integer idJornada, String estado);

    List<Partido> findByJornada_IdJornada(Integer idJornada);
}