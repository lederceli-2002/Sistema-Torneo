package com.leder.sistematorneos.service;

import com.leder.sistematorneos.DTO.AuthResponseDTO;
import com.leder.sistematorneos.DTO.LoginRequestDTO;
import com.leder.sistematorneos.DTO.RegistroUsuarioDTO;

public interface AuthService {

    AuthResponseDTO login (LoginRequestDTO request);
    AuthResponseDTO registrar(RegistroUsuarioDTO request);
}
