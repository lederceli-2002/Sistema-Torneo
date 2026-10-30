package com.leder.sistematorneos.repository;

import com.leder.sistematorneos.entity.EquipoJugador;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EquipoJugadorRepository extends JpaRepository<EquipoJugador, Integer> {

    // Carga los jugadores de la plantilla base de un equipo trayendo sus entidades asociadas
    @EntityGraph(attributePaths = {"jugador"})
    List<EquipoJugador> findByEquipo_IdEquipoAndEstado(Integer idEquipo, String estado);

    // Evita duplicar el mismo jugador en la plantilla del club
    boolean existsByEquipo_IdEquipoAndJugador_IdJugador(Integer idEquipo, Integer idJugador);
}
