package com.leder.sistematorneos.service.IMP;

import com.leder.sistematorneos.entity.Jugador;
import com.leder.sistematorneos.entity.ParticipacionJugadorTorneo;
import com.leder.sistematorneos.exception.RecursoNoEncontradoException;
import com.leder.sistematorneos.repository.JugadorRepository;
import com.leder.sistematorneos.repository.ParticipacionJugadorTorneoRepository;
import com.leder.sistematorneos.service.JugadorService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JugadorServiceIMP implements JugadorService {

    private final JugadorRepository jugadorRepository;
    private final ParticipacionJugadorTorneoRepository participacionJugadorTorneoRepository; // <-- INYECTAR

    public JugadorServiceIMP(JugadorRepository jugadorRepository,
                             ParticipacionJugadorTorneoRepository participacionJugadorTorneoRepository) {
        this.jugadorRepository = jugadorRepository;
        this.participacionJugadorTorneoRepository = participacionJugadorTorneoRepository;
    }

    @Override
    public List<ParticipacionJugadorTorneo> listarJugadoresPorEquipo(int idEquipo) {
        return participacionJugadorTorneoRepository.findByEquipo_IdEquipo(idEquipo);
    }

    @Override
    public Jugador registrarJugador(Jugador jugador) {
        return jugadorRepository.save(jugador);
    }

    @Override
    public Jugador consultarJugador(int id) {
        return jugadorRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Jugador no encontrado con id " + id));
    }

    @Override
    public List<Jugador> listarJugadores() {
        return jugadorRepository.findAll();
    }

    @Override
    public Jugador modificarJugador(Jugador jugador) {
        if (!jugadorRepository.existsById(jugador.getIdJugador())) {
            throw new RecursoNoEncontradoException("Jugador no encontrado con id " + jugador.getIdJugador());
        }
        return jugadorRepository.save(jugador);
    }

    @Override
    public boolean eliminarJugador(int id) {
        if (!jugadorRepository.existsById(id)) {
            throw new RecursoNoEncontradoException("Jugador no encontrado con id " + id);
        }
        jugadorRepository.deleteById(id);
        return true;
    }
}
