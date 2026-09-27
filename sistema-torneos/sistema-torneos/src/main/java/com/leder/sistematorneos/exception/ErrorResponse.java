package com.leder.sistematorneos.exception;

import java.time.LocalDateTime;

public class ErrorResponse {

    
    private final LocalDateTime timestamp; // fecha y hora del error
    private final int status;              // 400, 404, 409, 500...
    private final String error;            // "Bad Request", "Not Found", "Conflict"...
    private final String message;          // texto explicativo del problema
    private final String path;             // ruta solicitada (ej. /api/jugadores/999)


    public ErrorResponse(LocalDateTime timestamp, int status, String error, String message, String path) {
        this.timestamp = timestamp;
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
    }


    public LocalDateTime getTimestamp() { return timestamp; }
    public int getStatus() { return status; }
    public String getError() { return error; }
    public String getMessage() { return message; }
    public String getPath() { return path; }
}
