package br.edu.up.service;

import br.edu.up.model.Endereco;
import br.edu.up.model.Passageiro;
import br.edu.up.repository.EnderecoRepository;
import tools.jackson.databind.ObjectMapper;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.UUID;

public class EnderecoService {
    private final HttpClient client = HttpClient.newHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();
    private final EnderecoRepository repo = new EnderecoRepository();

    public Endereco criarEndereco(String cep) throws Exception {

        if(cep.isBlank()) throw new Exception("CEP é obrigatório");

        Endereco e;

        try {
            e = buscarEndereco(cep);
            e.setId(UUID.randomUUID().toString());
            repo.salvar(e);

        }catch (Exception ex){
            return null;
        }

        return e;
    }

    public Endereco buscarEndereco(String cep) throws Exception {
        String url = "https://viacep.com.br/ws/" + cep + "/json/";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        return mapper.readValue(response.body(), Endereco.class);
    }

}
