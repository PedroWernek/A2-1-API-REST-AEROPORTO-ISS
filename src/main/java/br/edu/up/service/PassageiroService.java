package br.edu.up.service;

import br.edu.up.model.Passageiro;
import br.edu.up.repository.PassageiroRepository;

import java.util.List;
import java.util.UUID;

public class PassageiroService {
    private final PassageiroRepository repo = new PassageiroRepository();

    public Passageiro criarPassageiro(Passageiro p) throws Exception {

        if (p.getNome() == null || p.getNome().isEmpty()) {
            throw new Exception("Nome é obrigatório");
        }
        if (p.getCpf() == null || p.getCpf().isEmpty()) {
            throw new Exception("CPF é obrigatório");
        }

        p.setId(UUID.randomUUID().toString());
        repo.salvar(p);
        return p;
    }

    public List<Passageiro> listarPassageiros() throws Exception {
        return repo.listar();
    }
}
