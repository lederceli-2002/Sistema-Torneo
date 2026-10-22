package com.leder.sistematorneos.service;

import com.leder.sistematorneos.entity.Tarjeta;
import java.util.List;
import java.util.Map;

public interface TarjetaService {
    List<Map<String, Object>> obtenerTarjetasPorJornada(Integer idJornada);
}