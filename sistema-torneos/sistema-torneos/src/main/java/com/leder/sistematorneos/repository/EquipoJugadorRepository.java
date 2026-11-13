package com.leder.sistematorneos.repository;

import com.leder.sistematorneos.entity.EquipoJugador;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EquipoJugadorRepository extends JpaRepository<EquipoJugador, Integer> {

    // Carga los jugadores de la plantilla base de un equipo trayendo sus entidades asociadas
    @EntityGraph(attributePaths = {"jugador"})
    List<EquipoJugador> findByEquipo_IdEquipoAndEstado(Integer idEquipo, String estado);

    // Evita duplicar el mismo jugador en la plantilla del club
    boolean existsByEquipo_IdEquipoAndJugador_IdJugador(Integer idEquipo, Integer idJugador);

    // Buscar plantilla base por ID del equipo
    List<EquipoJugador> findByEquipo_IdEquipo(Integer idEquipo);

    // Verificar si el jugador ya está registrado en este equipo

    // Eliminar un jugador específico de la plantilla del equipo
    @Modifying
    @Query("DELETE FROM EquipoJugador ej WHERE ej.equipo.idEquipo = :idEquipo AND ej.jugador.idJugador = :idJugador")
    void deleteByEquipoAndJugador(@Param("idEquipo") Integer idEquipo, @Param("idJugador") Integer idJugador);

    // Eliminar la plantilla completa (para eliminación en cascada del equipo)
    @Modifying
    @Query("DELETE FROM EquipoJugador ej WHERE ej.equipo.idEquipo = :idEquipo")
    void deleteByEquipoId(@Param("idEquipo") Integer idEquipo);
}
