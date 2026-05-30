package br.edu.up.service;

import java.util.List;
import java.util.UUID;

import br.edu.up.model.Passageiro;
import br.edu.up.repository.EnderecoRepository;
import br.edu.up.repository.PassageiroRepository;

public class PassageiroService {
    private final PassageiroRepository repo = new PassageiroRepository();
    private final EnderecoService endRepo = new EnderecoService();

    public Passageiro criarPassageiro(Passageiro p) throws Exception {

        if (p.getNome() == null || p.getNome().isEmpty()) {
            throw new Exception("Nome é obrigatório");
        }
        if (p.getCpf() == null || p.getCpf().isEmpty()) {
            throw new Exception("CPF é obrigatório");
        }
        if(buscarPassageiroPorCPF(p.getCpf()) != null){
            throw new Exception("CPF já cadastrado");
        }


        if(p.getEndereco() == null) {
            throw new Exception("Endereco é obrigatório");
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

    public Passageiro buscarPassageiroPorCPF(String cpf) throws Exception { return repo.buscarPorCPF(cpf); }

    public Passageiro atualizarPassageiro(String id, Passageiro p) throws Exception {
        Passageiro existente = buscarPassageiroPorId(id);

        if(p.getNome() == null || p.getNome().isEmpty()){
            throw new Exception("Nome é obrigatório");
        }
        if(p.getCpf() == null || p.getCpf().isEmpty()){
            throw new Exception("CPF é obrigatório");
        }
        if(p.getEndereco() != null){
            try {
                endRepo.atualizar();
            }
        }
        existente.setNome(p.getNome());
        existente.setCpf(p.getCpf());

        repo.atualizar(existente);
        return existente;
    }

    public Passageiro deletarPassageiro(String id) throws Exception {
        Passageiro p = buscarPassageiroPorId(id);

        endRepo.deletar(p.getEndereco().getId());
        repo.deletar(p.getId());
        return p;
    }
}
