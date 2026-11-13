package com.leder.sistematorneos.service.IMP;

import com.leder.sistematorneos.DTO.EquipoConPlantillaDTO;
import com.leder.sistematorneos.entity.Equipo;
import com.leder.sistematorneos.entity.EquipoJugador;
import com.leder.sistematorneos.entity.Jugador;
import com.leder.sistematorneos.exception.RecursoNoEncontradoException;
import com.leder.sistematorneos.exception.ReglaDeNegocioException;
import com.leder.sistematorneos.repository.EquipoJugadorRepository;
import com.leder.sistematorneos.repository.EquipoRepository;
import com.leder.sistematorneos.repository.JugadorRepository;
import com.leder.sistematorneos.repository.ParticipacionEquipoTorneoRepository;
import com.leder.sistematorneos.service.EquipoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EquipoServiceIMP implements EquipoService {


    @Autowired
    private EquipoRepository equipoRepository;

    @Autowired
    private EquipoJugadorRepository equipoJugadorRepository;

    @Autowired
    private JugadorRepository jugadorRepository;


    private final ParticipacionEquipoTorneoRepository participacionEquipoTorneoRepository;

    // INYECCION POR CONSTRUCTOR
    public EquipoServiceIMP(EquipoRepository equipoRepository,
                            ParticipacionEquipoTorneoRepository participacionEquipoTorneoRepository){
        this.equipoRepository = equipoRepository;
        this.participacionEquipoTorneoRepository = participacionEquipoTorneoRepository;
    }

    @Override
    public Equipo registrarEquipo(Equipo equipo) {
        if (equipoRepository.existsByNombreIgnoreCase(equipo.getNombre())) {
            throw new ReglaDeNegocioException("Ya existe un equipo con el nombre: " + equipo.getNombre());
        }
        return equipoRepository.save(equipo);
    }

    @Override
    public Equipo consultarEquipo(int id) {
        return equipoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Equipo no encontrado con id " + id));
    }

    @Override
    public List<Equipo> listarEquipos() {
        return equipoRepository.findAll();
    }

    @Override
    public Equipo modificarEquipo(Equipo equipo) {
        if (!equipoRepository.existsById(equipo.getIdEquipo())) {
            throw new RecursoNoEncontradoException("Equipo no encontrado con id " + equipo.getIdEquipo());
        }
        if (equipoRepository.existsByNombreIgnoreCaseAndIdEquipoNot(equipo.getNombre(), equipo.getIdEquipo())) {
            throw new ReglaDeNegocioException("Ya existe otro equipo con el nombre: " + equipo.getNombre());
        }
        return equipoRepository.save(equipo);
    }

    @Override
    public boolean eliminarEquipo(int id) {
        if (!equipoRepository.existsById(id)) {
            throw new RecursoNoEncontradoException("Equipo no encontrado con id " + id);
        }
        // Un equipo inscrito en un torneo tiene partidos y jugadores asociados
        if (participacionEquipoTorneoRepository.existsByEquipo_IdEquipo(id)) {
            throw new ReglaDeNegocioException("No se puede eliminar el equipo: esta inscrito en un torneo");
        }
        equipoRepository.deleteById(id);
        return true;
    }

    @Override
    @Transactional
    public Equipo registrarEquipoPlantilla(EquipoConPlantillaDTO dto) {
        // 1. Guardar la entidad maestra Equipo
        Equipo equipo = new Equipo();
        equipo.setNombre(dto.getNombre());
        equipo.setDescripcion(dto.getDescripcion());
        equipo.setCiudad(dto.getCiudad());
        equipo.setEscudo(dto.getEscudo());
        equipo.setEstado(dto.getEstado()); // Devolverá "ACTIVO" por defecto

        Equipo equipoGuardado = equipoRepository.save(equipo);

        // 2. Asociar los jugadores a la plantilla base atemporal (equipo_jugador)
        if (dto.getIdsJugadores() != null && !dto.getIdsJugadores().isEmpty()) {
            for (Integer idJugador : dto.getIdsJugadores()) {
                Jugador jugador = jugadorRepository.findById(idJugador)
                        .orElseThrow(() -> new RecursoNoEncontradoException("Jugador no encontrado con ID: " + idJugador));

                if (!equipoJugadorRepository.existsByEquipo_IdEquipoAndJugador_IdJugador(equipoGuardado.getIdEquipo(), idJugador)) {
                    EquipoJugador plantilla = new EquipoJugador(equipoGuardado, jugador);
                    equipoJugadorRepository.save(plantilla);
                }
            }
        }

        return equipoGuardado;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Jugador> obtenerPlantillaBaseEquipo(Integer idEquipo) {
        // Busca los registros en equipo_jugador para ese idEquipo
        List<EquipoJugador> plantilla = equipoJugadorRepository.findByEquipo_IdEquipoAndEstado(idEquipo, "ACTIVO");

        // Extrae y retorna la lista limpia de entidades Jugador
        return plantilla.stream()
                .map(EquipoJugador::getJugador)
                .collect(Collectors.toList());
    }

    @Override
    public List<EquipoJugador> obtenerPlantillaEquipo(Integer idEquipo) {
        return equipoJugadorRepository.findByEquipo_IdEquipo(idEquipo);
    }

    /// NO TIENE NUMERO DE CAMISETA REVISAR ESE ERROR(PERO FUNCIONA)
    @Transactional
    @Override
    public void agregarJugadorAPlantilla(Integer idEquipo, Integer idJugador) {
        if (equipoJugadorRepository.existsByEquipo_IdEquipoAndJugador_IdJugador(idEquipo, idJugador)) {
            throw new RuntimeException("El jugador ya pertenece a la plantilla de este equipo.");
        }

        Equipo equipo = equipoRepository.findById(idEquipo)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado con ID: " + idEquipo));

        Jugador jugador = jugadorRepository.findById(idJugador)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado con ID: " + idJugador));

        EquipoJugador relacion = new EquipoJugador();
        relacion.setEquipo(equipo);
        relacion.setJugador(jugador);


        equipoJugadorRepository.save(relacion);

    }

    @Transactional
    @Override
    public void removerJugadorDePlantilla(Integer idEquipo, Integer idJugador) {
        equipoJugadorRepository.deleteByEquipoAndJugador(idEquipo, idJugador);
    }

    @Transactional
    @Override
    public boolean eliminarEquipoCascada(int id) {
        // 1. Verificar si el equipo existe
        if (!equipoRepository.existsById(id)) {
            throw new RecursoNoEncontradoException("Equipo no encontrado con id: " + id);
        }
        // 2. Eliminar la plantilla base del equipo primero (evita violar FK)
        equipoJugadorRepository.deleteByEquipoId(id);
        // 3. Eliminar la entidad equipo
        equipoRepository.deleteById(id);
        return true;
    }


}
