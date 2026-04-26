package br.edu.up.service;

import br.edu.up.model.Voo;
import br.edu.up.repository.VooRepository;

import java.sql.SQLException;
import java.util.List;
import java.util.UUID;

public class VooService {
	
	private final VooRepository repo = new VooRepository();

    public Voo criarVoo(Voo p) throws Exception {

        if (p.getOrigem() == null || p.getOrigem().isEmpty()) {
            throw new Exception("Origem é obrigatório!");
        }
        
        if (p.getDestino() == null || p.getDestino().isEmpty()) {
            throw new Exception("Destino é obrigatório!");
        }

        if (p.getDataHoraVoo() == null || p.getDataHoraVoo().isEmpty()) {
            throw new Exception("Data e Hora do Voo é obrigatório!");
        }
        
        //Acredito que a única excessão para assentos dispoíveis deve ser se for menor que zero, pq se for zero, quer dizer q n tem mais assentos disponíveis
        if (p.getAssentosDisponiveis() < 0) {
            throw new Exception("Assentos Disponíveis não pode ser menor que zero!");
        }
        
        if (p.getAeronave() == null) {
            throw new Exception("Aeronave é obrigatório!");
        }

        p.setId(UUID.randomUUID().toString());
        repo.salvar(p);
        return p;
    }

    public List<Voo> listarVoos() throws Exception {
        return repo.listar();
    }

    public Voo buscarVooPorId(String id) throws Exception {
        Voo p = repo.buscarPorId(id);
        if (p == null){
            throw new Exception("Voo não encontrado");
        }
        return p;
    }

    public Voo atualizarVoo(String id, Voo p) throws Exception {
        Voo existente = buscarVooPorId(id);

        if (p.getOrigem() == null || p.getOrigem().isEmpty()) {
            throw new Exception("Origem é obrigatório!");
        }
        
        if (p.getDestino() == null || p.getDestino().isEmpty()) {
            throw new Exception("Destino é obrigatório!");
        }

        if (p.getDataHoraVoo() == null || p.getDataHoraVoo().isEmpty()) {
            throw new Exception("Data e Hora do Voo é obrigatório!");
        }
        
        //Acredito que a única excessão para assentos dispoíveis deve ser se for menor que zero, pq se for zero, quer dizer q n tem mais assentos disponíveis
        if (p.getAssentosDisponiveis() < 0) {
            throw new Exception("Assentos Disponíveis não pode ser menor que zero!");
        }
        
        if (p.getAeronave() == null) {
            throw new Exception("Aeronave é obrigatório!");
        }
        
        existente.setOrigem(p.getOrigem());
        existente.setDestino(p.getDestino());
        existente.setDataHoraVoo(p.getDataHoraVoo());
        existente.setAssentosDisponiveis(p.getAssentosDisponiveis());
        existente.setAeronave(p.getAeronave());
        

        

        repo.atualizar(existente);
        return existente;
    }

    public Voo deletarVoo(String id) throws Exception {
        Voo p = buscarVooPorId(id);

        repo.deletar(id);
        return p;
    }

}
