package com.leder.sistematorneos.exception;

/*
 * ============================================================================
 *  ReglaDeNegocioException
 * ============================================================================
 *
 *  Igual que RecursoNoEncontradoException, pero se usa para OTRA situacion:
 *  cuando el recurso SI existe, pero la operacion rompe una regla del negocio.
 *
 *  Ejemplos de reglas de negocio de este sistema:
 *    - Un equipo no puede estar dos veces en la misma serie.
 *    - Un jugador no puede inscribirse dos veces en el mismo torneo.
 *    - No se puede eliminar un torneo que ya tiene equipos inscritos.
 *
 *  Es decir:
 *    RecursoNoEncontradoException -> el recurso no existe     -> HTTP 404
 *    ReglaDeNegocioException      -> el recurso existe, pero
 *                                    la operacion no está permitida -> HTTP 409
 *
 *  Sigue siendo "unchecked" (RuntimeException) para no contaminar los services.
 */
public class ReglaDeNegocioException extends RuntimeException {

    // El mensaje explicará al usuario POR QUE no se pudo hacer la operacion.
    public ReglaDeNegocioException(String mensaje) {
        super(mensaje);
    }
}
