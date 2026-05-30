package br.edu.up.repository.connection;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import br.edu.up.model.Endereco;
import tools.jackson.databind.ObjectMapper;

public class ViaCepClient {
    private final ObjectMapper mapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public Endereco buscarEndereco(String cep) throws Exception {
        cep = cep.replaceAll("[^0-9]", "");

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://viacep.com.br/ws/" + cep + "/json/"))
                .GET()
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
            return mapper.readValue(response.body(), Endereco.class);
        } else {
            throw new Exception("Erro ao buscar CEP. Status: " + response.statusCode());
        }
    }
}