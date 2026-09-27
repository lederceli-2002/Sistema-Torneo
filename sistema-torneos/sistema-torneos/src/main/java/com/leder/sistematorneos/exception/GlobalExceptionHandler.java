package com.leder.sistematorneos.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger; 
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;


@RestControllerAdvice
public class GlobalExceptionHandler {


    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);


    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<ErrorResponse> manejarNoEncontrado(
            RecursoNoEncontradoException ex, HttpServletRequest request) {

        ErrorResponse body = new ErrorResponse(
                LocalDateTime.now(),                           
                HttpStatus.NOT_FOUND.value(),                   // 404  (value() lo pasa a int)
                HttpStatus.NOT_FOUND.getReasonPhrase(),         // "Not Found"
                ex.getMessage(),                                
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }


   
    @ExceptionHandler(ReglaDeNegocioException.class)
    public ResponseEntity<ErrorResponse> manejarReglaDeNegocio(
            ReglaDeNegocioException ex, HttpServletRequest request) {

        ErrorResponse body = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.CONFLICT.value(),                    // 409
                HttpStatus.CONFLICT.getReasonPhrase(),          // "Conflict"
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }


    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> manejarValidacion(
            MethodArgumentNotValidException ex, HttpServletRequest request) {

        FieldError campoError = ex.getBindingResult().getFieldError();

        String mensaje = (campoError != null)
                ? campoError.getField() + ": " + campoError.getDefaultMessage()
                : "Datos invalidos";                                          

        ErrorResponse body = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),                 // 400
                HttpStatus.BAD_REQUEST.getReasonPhrase(),       // "Bad Request"
                mensaje,
                request.getRequestURI()
        );
        return ResponseEntity.badRequest().body(body);
    }


    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> manejarIntegridad(
            DataIntegrityViolationException ex, HttpServletRequest request) {

        log.warn("Violacion de integridad en {}", request.getRequestURI(), ex);

        ErrorResponse body = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.CONFLICT.value(),                    // 409
                HttpStatus.CONFLICT.getReasonPhrase(),          // "Conflict"
                "No se puede completar la operacion: el registro esta en uso o duplicado",
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }


   
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> manejarGenerico(
            Exception ex, HttpServletRequest request) {

        log.error("Error no controlado en {}", request.getRequestURI(), ex);

        ErrorResponse body = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),                    // 500
                HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),          // "Internal Server Error"
                "Ocurrio un error inesperado",
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}
