package br.edu.up.service;

import br.edu.up.model.Aeronave;
import br.edu.up.repository.AeronaveRepository;
import java.util.List;
import java.util.UUID;

public class AeronaveService {
    private final AeronaveRepository repo = new AeronaveRepository();

    public Aeronave criarAeronave(Aeronave p) throws Exception {

        if (p.getCapacidadeAssentos() <= 0 || p.getCapacidadeAssentos() > 1000) {
            throw new Exception("Capacidade de aeronave inválida");
        }
        if  ("Militar".equals(p.getTipo()) || "Guerra".equals(p.getTipo()) || p.getTipo().isEmpty()) {
            throw new Exception("Tipo de aeronave inválido");
        }

        if (p.getModelo().isEmpty()) {
            throw new Exception("Modelo de aeronave vazio");
        }

        p.setId(UUID.randomUUID().toString());
        repo.salvar(p);
        return p;
    }

    public List<Aeronave> listarAeronaves() throws Exception {
        return repo.listar();
    }

    public Aeronave buscarAeronavePorId(String id) throws Exception {
        Aeronave p = repo.buscarPorId(id);
        if (p == null){
            throw new Exception("Aeronave não encontrada");
        }
        return p;
    }

    public Aeronave atualizarAeronave(String id, Aeronave p) throws Exception {
        Aeronave existente = buscarAeronavePorId(id);

        if (p.getCapacidadeAssentos() <= 0 || p.getCapacidadeAssentos() > 1000) {
            throw new Exception("Capacidade de aeronave inválida");
        }
        if (p.getTipo() == "Militar" || p.getTipo() == "Guerra"  || p.getTipo().isEmpty()) {
            throw new Exception("Tipo de aeronave inválida");
        }

        if (p.getModelo().isEmpty()) {
            throw new Exception("Modelo de aeronave vazio");
        }

        existente.setCapacidadeAssentos(p.getCapacidadeAssentos());
        existente.setTipo(p.getTipo());
        existente.setModelo(p.getModelo());

        repo.atualizar(existente);
        return existente;
    }

    public Aeronave deletarAeronave(String id) throws Exception {
        Aeronave p = buscarAeronavePorId(id);

        repo.deletar(id);
        return p;
    }
}
