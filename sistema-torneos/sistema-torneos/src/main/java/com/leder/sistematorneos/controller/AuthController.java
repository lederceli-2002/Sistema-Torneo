package com.leder.sistematorneos.controller;

import com.leder.sistematorneos.DTO.AuthResponseDTO;
import com.leder.sistematorneos.DTO.LoginRequestDTO;
import com.leder.sistematorneos.DTO.RegistroUsuarioDTO;
import com.leder.sistematorneos.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {


    @Autowired
    private AuthService authService;

    //END POINT DE LOGEO
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO request){
        try{
            AuthResponseDTO response = authService.login(request);
            return ResponseEntity.ok(response);
        }catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", e.getMessage()));
        }
    }

    //END POIN DE REGISTRO
    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@RequestBody RegistroUsuarioDTO request){
        try{
            AuthResponseDTO response = authService.registrar(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }catch(RuntimeException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message",e.getMessage()));
        }
    }
}
