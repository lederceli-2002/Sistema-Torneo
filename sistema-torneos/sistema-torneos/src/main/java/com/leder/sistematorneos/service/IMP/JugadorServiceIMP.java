package com.leder.sistematorneos.service.IMP;

import com.leder.sistematorneos.entity.Jugador;
import com.leder.sistematorneos.repository.JugadorRepository;
import com.leder.sistematorneos.service.JugadorService;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class JugadorServiceIMP implements JugadorService {

    private final JugadorRepository jugadorRepository;
    public JugadorServiceIMP(JugadorRepository jugadorRepository){
        this.jugadorRepository = jugadorRepository;
    }

    @Override
    public Jugador registrarJugador(Jugador jugador) {
        return jugadorRepository.save(jugador);
    }

    @Override
    public Jugador consultarJugador(int id) {
        if(!jugadorRepository.existsById(id)){
            return null;
        }
        return jugadorRepository.findById(id).orElse(null);
    }

    @Override
    public List<Jugador> listarJugadores() {
        return jugadorRepository.findAll();
    }

    @Override
    public Jugador modificarJugador(Jugador jugador) {
        return jugadorRepository.save(jugador);
    }

    @Override
    public boolean eliminarJugador(int id) {
        if(!jugadorRepository.existsById(id)){
            return false;
        }
        jugadorRepository.deleteById(id);
        return true;
    }
}
