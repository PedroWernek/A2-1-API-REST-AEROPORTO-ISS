package br.edu.up.service;

import br.edu.up.model.Endereco;
import br.edu.up.repository.EnderecoRepository;
import java.util.UUID;

public class EnderecoService {
    private final EnderecoRepository repo = new EnderecoRepository();

    public Endereco salvar(Endereco e) throws Exception {
        if (e.getId() == null) {
            e.setId(UUID.randomUUID().toString());
        }
        repo.salvar(e);
        return e;
    }
    public Endereco buscarPorId(String id) throws Exception {
        return repo.buscarPorId(id);
    }

    public Endereco atualizar(Endereco e) throws Exception {
        repo.atualizar(e);
        return e;
    }

    public void deletar(String id) throws Exception {
        repo.deletar(id);
    }
}