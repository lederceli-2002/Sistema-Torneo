package com.leder.sistematorneos.repository;

import com.leder.sistematorneos.entity.RankingJornada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RankingJornadaRepository extends JpaRepository<RankingJornada, Integer> {

    // Método 1: Búsqueda derivada JPA
    List<RankingJornada> findByJornada_IdJornadaOrderByPuntosDescDiferenciaGolesDesc(Integer idJornada);

    // Método 2: Consulta explícita JPQL para evitar ambigüedades en relaciones anidadas
    @Query("SELECT r FROM RankingJornada r WHERE r.jornada.idJornada = :idJornada ORDER BY r.puntos DESC, r.diferenciaGoles DESC")
    List<RankingJornada> obtenerRankingPorIdJornada(@Param("idJornada") Integer idJornada);
}