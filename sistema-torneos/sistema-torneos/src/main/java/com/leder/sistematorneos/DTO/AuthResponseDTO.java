package com.leder.sistematorneos.DTO;

public class AuthResponseDTO {
    private Integer idUsuario;
    private String nombres;
    private String apellidos;
    private String email;
    private String rol;
    private String mensaje;

    public AuthResponseDTO(Integer idUsuario, String nombres, String apellidos, String email, String rol, String mensaje) {
        this.idUsuario = idUsuario;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.email = email;
        this.rol = rol;
        this.mensaje = mensaje;
    }

    public Integer getIdUsuario() { return idUsuario; }
    public String getNombres() { return nombres; }
    public String getApellidos() { return apellidos; }
    public String getEmail() { return email; }
    public String getRol() { return rol; }
    public String getMensaje() { return mensaje; }
}