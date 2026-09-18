package com.leder.sistematorneos.repository.IMP;

import com.leder.sistematorneos.DTO.TorneoDTO;
import com.leder.sistematorneos.repository.TorneoRepositoryCustom;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

public class TorneoRepositoryCustomImpl implements TorneoRepositoryCustom {
    //
    private final JdbcTemplate jdbcTemplate;

    //INYECION POR CONSTRUCORS
    public TorneoRepositoryCustomImpl(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<TorneoDTO> tarjeterosTorneo() {
        String sql = "SELECT * FROM fn_listar_tarjeteros_torneos();";


        return jdbcTemplate.query(sql, (rs, rowNum) -> {

            TorneoDTO dto = new TorneoDTO();

            dto.setId(rs.getInt("id_torneo"));
            dto.setNombre(rs.getString("nombre"));
            dto.setEstado(rs.getString("estado"));

            dto.setFechaInicio(
                    rs.getObject("fecha_inicio", java.time.LocalDate.class)
            );

            dto.setFechaFin(
                    rs.getObject("fecha_fin", java.time.LocalDate.class)
            );

            dto.setCantidadEquipos(
                    rs.getInt("cantidad_equipos")
            );

            dto.setSeries(
                    rs.getInt("series")
            );

            Integer proximaJornada =
                    rs.getObject("proxima_jornada", Integer.class);

            dto.setProximaJornada(proximaJornada);

            return dto;
        });
    }

}

