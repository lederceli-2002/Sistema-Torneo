package com.leder.sistematorneos.repository;

import com.leder.sistematorneos.entity.Equipo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EquipoRepository extends JpaRepository<Equipo, Integer> {

    // Para registrar: ¿ya existe un equipo con ese nombre?
    boolean existsByNombreIgnoreCase(String nombre);

    // Para editar: ¿existe OTRO equipo (distinto id) con ese nombre?
    boolean existsByNombreIgnoreCaseAndIdEquipoNot(String nombre, Integer idEquipo);
}