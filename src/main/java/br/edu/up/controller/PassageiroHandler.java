package br.edu.up.controller;

import br.edu.up.model.Passageiro;
import br.edu.up.service.PassageiroService;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

public class PassageiroHandler implements HttpHandler {
    private final ObjectMapper mapper = new ObjectMapper();
    private final PassageiroService service = new PassageiroService();

    @Override
    public void handle(HttpExchange exchange) throws IOException {

        try {

            if (exchange.getRequestMethod().equals("GET")) {
                listar(exchange);
            }
            else if (exchange.getRequestMethod().equals("POST")) {
                criar(exchange);
            } else {
                exchange.sendResponseHeaders(405, -1);
            }

        } catch (Exception e) {
            exchange.sendResponseHeaders(500, -1);
        }

    }

    private void listar(HttpExchange exchange) throws Exception {
        List<Passageiro> produtos = service.listarPassageiros();
        String json = mapper.writeValueAsString(produtos);
        enviar(exchange, json);
    }

    private void criar(HttpExchange exchange) throws Exception {
        Passageiro p = mapper.readValue(exchange.getRequestBody(), Passageiro.class);
        Passageiro criado = service.criarPassageiro(p);
        String json = mapper.writeValueAsString(criado);
        enviar(exchange, json);
    }

    private void enviar(HttpExchange exchange, String resposta) throws IOException {
        exchange.getResponseHeaders().add("Content-Type", "application/json");
        exchange.sendResponseHeaders(200, resposta.getBytes().length);
        OutputStream os = exchange.getResponseBody();
        os.write(resposta.getBytes());
        os.close();
    }
}