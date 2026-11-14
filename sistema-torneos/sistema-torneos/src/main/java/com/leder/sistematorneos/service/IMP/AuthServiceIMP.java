package com.leder.sistematorneos.service.IMP;

import com.leder.sistematorneos.DTO.AuthResponseDTO;
import com.leder.sistematorneos.DTO.LoginRequestDTO;
import com.leder.sistematorneos.DTO.RegistroUsuarioDTO;
import com.leder.sistematorneos.entity.Usuario;
import com.leder.sistematorneos.repository.UsuarioRepository;
import com.leder.sistematorneos.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.query.FluentQuery;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;

@Service
public class AuthServiceIMP implements AuthService {

    @Autowired
    private UsuarioRepository _usuarioRepository;

    @Override
    public AuthResponseDTO login(LoginRequestDTO request) {
        //Recuperamos por Email
        Usuario usuario = _usuarioRepository.findByEmail(request.getEmail()).orElseThrow(()-> new RuntimeException("El correo no esta registrado"));
            if(!"ACTIVO".equalsIgnoreCase(usuario.getEstado())){
                throw  new RuntimeException("El usuario se encuentra inactivo");
            }
            if(!usuario.getPassword().equals(request.getPassword())){
                throw  new RuntimeException("Contraseña incorrecta");
            }

            return new AuthResponseDTO(
                    usuario.getIdUsuario(),
                    usuario.getNombres(),
                    usuario.getApellidos(),
                    usuario.getEmail(),
                    usuario.getRol(),
                    "Inicio de sesión existoso"
            );

    }

    @Override
    @Transactional
    public AuthResponseDTO registrar(RegistroUsuarioDTO request) {
        if(_usuarioRepository.existsByEmail(request.getEmail())){
            throw  new RuntimeException("Este coreo electronico ya fue registrado");
        }
        Usuario nuevo = new Usuario();
        nuevo.setNombres(request.getNombres());
        nuevo.setApellidos(request.getApellidos());
        nuevo.setEmail(request.getEmail());
        nuevo.setPassword(request.getPassword());
        nuevo.setRol(request.getRol() != null && !request.getRol().isBlank()
                ? request.getRol()
                : "ENCARGADO_PARTIDO");
        nuevo.setEstado("ACTIVO");
        Usuario guardado = _usuarioRepository.save(nuevo);
        return new AuthResponseDTO(
                guardado.getIdUsuario(),
                guardado.getNombres(),
                guardado.getApellidos(),
                guardado.getEmail(),
                guardado.getRol(),
                "Usuario registrado correctamente"
        );
    }
}
