package br.edu.up.service;

import br.edu.up.model.Passagem;
import br.edu.up.model.Voo;
import br.edu.up.model.Passageiro;
import br.edu.up.repository.PassagemRepository;
import br.edu.up.repository.VooRepository;
import br.edu.up.repository.PassageiroRepository;

import java.util.List;
import java.util.UUID;

public class PassagemService {

    private final PassagemRepository repo = new PassagemRepository();
    private final VooRepository vooRepo = new VooRepository();
    private final PassageiroRepository passageiroRepo = new PassageiroRepository();

    public Passagem criarPassagem(Passagem p) throws Exception {

        if (p.getAssento() == null || p.getAssento().isEmpty()) {
            throw new Exception("Assento é obrigatório");
        }

        if (p.getValor() <= 0) {
            throw new Exception("Valor deve ser maior que zero");
        }

        if (p.getVoo() == null || p.getVoo().getId() == null) {
            throw new Exception("Voo é obrigatório");
        }

        if (p.getPassageiro() == null || p.getPassageiro().getId() == null) {
            throw new Exception("Passageiro é obrigatório");
        }

        Voo voo = vooRepo.buscarPorId(p.getVoo().getId());
        if (voo == null) {
            throw new Exception("Voo não encontrado");
        }

        if (voo.getAssentosDisponiveis() <= 0) {
            throw new Exception("Não há assentos disponíveis para este voo");
        }

        Passageiro passageiro = passageiroRepo.buscarPorId(p.getPassageiro().getId());
        if (passageiro == null) {
            throw new Exception("Passageiro não encontrado");
        }

        p.setVoo(voo);
        p.setPassageiro(passageiro);

        voo.setAssentosDisponiveis(voo.getAssentosDisponiveis() - 1);
        vooRepo.atualizar(voo);

        p.setId(UUID.randomUUID().toString());
        repo.salvar(p);

        return p;
    }

    public List<Passagem> listarPassagens() throws Exception {
        return repo.listar();
    }

    public Passagem buscarPassagemPorId(String id) throws Exception {
        Passagem p = repo.buscarPorId(id);
        if (p == null) {
            throw new Exception("Passagem não encontrada");
        }
        return p;
    }

    public Passagem atualizarPassagem(String id, Passagem p) throws Exception {
        Passagem existente = buscarPassagemPorId(id);

        if (p.getAssento() == null || p.getAssento().isEmpty()) {
            throw new Exception("Assento é obrigatório");
        }

        if (p.getValor() <= 0) {
            throw new Exception("Valor deve ser maior que zero");
        }

        if (p.getVoo() == null || p.getVoo().getId() == null) {
            throw new Exception("Voo é obrigatório");
        }

        if (p.getPassageiro() == null || p.getPassageiro().getId() == null) {
            throw new Exception("Passageiro é obrigatório");
        }

        Voo novoVoo = vooRepo.buscarPorId(p.getVoo().getId());
        if (novoVoo == null) {
            throw new Exception("Voo não encontrado");
        }

        Passageiro passageiro = passageiroRepo.buscarPorId(p.getPassageiro().getId());
        if (passageiro == null) {
            throw new Exception("Passageiro não encontrado");
        }

        String idVooAntigo = existente.getVoo().getId();
        String idNovoVoo = novoVoo.getId();

        if (!idVooAntigo.equals(idNovoVoo)) {

            if (novoVoo.getAssentosDisponiveis() <= 0) {
                throw new Exception("Não há assentos disponíveis no novo voo escolhido.");
            }

            Voo vooAntigo = vooRepo.buscarPorId(idVooAntigo);
            vooAntigo.setAssentosDisponiveis(vooAntigo.getAssentosDisponiveis() + 1);
            vooRepo.atualizar(vooAntigo);

            novoVoo.setAssentosDisponiveis(novoVoo.getAssentosDisponiveis() - 1);
            vooRepo.atualizar(novoVoo);
        }

        existente.setAssento(p.getAssento());
        existente.setValor(p.getValor());
        existente.setVoo(novoVoo);
        existente.setPassageiro(passageiro);

        repo.atualizar(existente);
        return existente;
    }

    public Passagem deletarPassagem(String id) throws Exception {
        Passagem p = buscarPassagemPorId(id);

        Voo voo = p.getVoo();
        voo.setAssentosDisponiveis(voo.getAssentosDisponiveis() + 1);
        vooRepo.atualizar(voo);

        repo.deletar(id);
        return p;
    }
}