package br.edu.up.service;

import java.util.List;
import java.util.UUID;

import br.edu.up.model.Endereco;
import br.edu.up.model.Passageiro;
import br.edu.up.repository.PassageiroRepository;
import br.edu.up.repository.connection.ViaCepClient;

public class PassageiroService {
    private final PassageiroRepository repo = new PassageiroRepository();

    private final EnderecoService endService = new EnderecoService();
    private final ViaCepClient viaCepClient = new ViaCepClient(); // Para consumo da API Externa

    public Passageiro criarPassageiro(Passageiro p) throws Exception {

        if(p.getEndereco() != null && p.getEndereco().getCep() != null) {
            Endereco enderecoCompleto = viaCepClient.buscarEndereco(p.getEndereco().getCep());
            enderecoCompleto.setId(UUID.randomUUID().toString());

            endService.salvar(enderecoCompleto);
            p.setEndereco(enderecoCompleto);
        } else {
            throw new Exception("CEP do endereço é obrigatório");
        }

        p.setId(UUID.randomUUID().toString());
        repo.salvar(p);

        return p;
    }

    public Passageiro buscarPassageiroPorId(String id) throws Exception {
        Passageiro p = repo.buscarPorId(id);
        if (p == null) throw new Exception("Passageiro não encontrado");

        if (p.getEndereco() != null && p.getEndereco().getId() != null) {
            Endereco enderecoCompleto = endService.buscarPorId(p.getEndereco().getId());
            p.setEndereco(enderecoCompleto);
        }

        return p;
    }

    public List<Passageiro> listarPassageiros() throws Exception {
        List<Passageiro> passageiros = repo.listar();

        for (Passageiro p : passageiros) {
            if (p.getEndereco() != null && p.getEndereco().getId() != null) {
                Endereco enderecoCompleto = endService.buscarPorId(p.getEndereco().getId());
                p.setEndereco(enderecoCompleto);
            }
        }
        return passageiros;
    }
    public Passageiro atualizarPassageiro(String id, Passageiro p) throws Exception {
        Passageiro existente = buscarPassageiroPorId(id);

        if (p.getNome() == null || p.getNome().isEmpty()) {
            throw new Exception("Nome é obrigatório");
        }
        if (p.getCpf() == null || p.getCpf().isEmpty()) {
            throw new Exception("CPF é obrigatório");
        }

        if (p.getEndereco() != null && p.getEndereco().getCep() != null) {
            Endereco enderecoCompleto = viaCepClient.buscarEndereco(p.getEndereco().getCep());

            if (existente.getEndereco() != null && existente.getEndereco().getId() != null) {

                enderecoCompleto.setId(existente.getEndereco().getId());

                endService.atualizar(enderecoCompleto);

                existente.setEndereco(enderecoCompleto);
            } else {
                enderecoCompleto.setId(UUID.randomUUID().toString());
                endService.salvar(enderecoCompleto);
                existente.setEndereco(enderecoCompleto);
            }
        }

        existente.setNome(p.getNome());
        existente.setCpf(p.getCpf());

        repo.atualizar(existente);

        return existente;
    }

    public Passageiro deletarPassageiro(String id) throws Exception {
        Passageiro p = buscarPassageiroPorId(id);

        repo.deletar(p.getId());

        if (p.getEndereco() != null && p.getEndereco().getId() != null) {
            endService.deletar(p.getEndereco().getId());
        }

        return p;
    }
}