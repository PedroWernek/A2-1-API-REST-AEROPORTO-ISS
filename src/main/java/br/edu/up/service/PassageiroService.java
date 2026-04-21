package br.edu.up.service;

import br.edu.up.model.Passageiro;
import br.edu.up.repository.PassageiroRepository;

import java.sql.SQLException;
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

    public Passageiro buscarPassageiroPorId(String id) throws Exception {
        Passageiro p = repo.buscarPorId(id);
        if (p == null){
            throw new Exception("Passageiro não encontrado");
        }
        return p;
    }

    public Passageiro atualizarPassageiro(String id, Passageiro p) throws Exception {
        Passageiro existente = buscarPassageiroPorId(id);

        if(p.getNome() == null || p.getNome().isEmpty()){
            throw new Exception("Nome é obrigatório");
        }
        existente.setNome(p.getNome());
        existente.setCpf(p.getCpf());

        repo.atualizar(existente);
        return existente;
    }

    public Passageiro deletarPassageiro(String id) throws Exception {
        Passageiro p = buscarPassageiroPorId(id);

        repo.deletar(id);
        return p;
    }
}
