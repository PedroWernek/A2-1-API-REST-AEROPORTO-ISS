package br.edu.up.controller;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

import br.edu.up.messaging.RabbitMQProducer;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import br.edu.up.model.Passageiro;
import br.edu.up.service.PassageiroService;
import tools.jackson.databind.ObjectMapper;

public class PassageiroHandler implements HttpHandler {
    private final ObjectMapper mapper = new ObjectMapper();
    private final PassageiroService service = new PassageiroService();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String path = exchange.getRequestURI().getPath();
        String[] parts = path.split("/");

        String id = (parts.length > 2) ? parts[2] : null;

        try {
            switch (exchange.getRequestMethod()){
                case "GET":
                    if(id == null) listar(exchange);
                    else buscar(exchange, id);
                    break;
                case "POST":
                    criar(exchange);
                    break;
                case "PUT":
                    if(id != null) atualizar(exchange, id);
                    else exchange.sendResponseHeaders(400, -1);
                    break;
                case "DELETE":
                    if(id != null) deletar(exchange, id);
                    else exchange.sendResponseHeaders(400, -1);
                    break;
                default:
                    exchange.sendResponseHeaders(405, -1);
            }

        } catch (Exception e) {
            System.out.println(e.getMessage());
            enviarErro(exchange, e.getMessage());
        }
    }

    private void listar(HttpExchange exchange) throws Exception {
        List<Passageiro> passageiros = service.listarPassageiros();
        String json = mapper.writeValueAsString(passageiros);
        enviar(exchange, json);
    }

    private void criar(HttpExchange exchange) throws Exception {
        Passageiro p = mapper.readValue(exchange.getRequestBody(), Passageiro.class);

        Passageiro criado = service.criarPassageiro(p);
        String json = mapper.writeValueAsString(criado);

        enviar(exchange, json);
        String msg = "Passageiro cadastrado: " + criado.getId();
        RabbitMQProducer.enviarMensagem(msg);
    }

    private void buscar(HttpExchange exchange, String id) throws Exception {
        Passageiro p = service.buscarPassageiroPorId(id);
        enviar(exchange, mapper.writeValueAsString(p));
    }

    private void atualizar(HttpExchange exchange, String id) throws Exception {
        Passageiro p = mapper.readValue(exchange.getRequestBody(), Passageiro.class);
        Passageiro atualizado = service.atualizarPassageiro(id, p);
        enviar(exchange, mapper.writeValueAsString(atualizado));
    }

    private void deletar(HttpExchange exchange, String id) throws Exception {
        Passageiro p = service.deletarPassageiro(id);
        enviar(exchange, mapper.writeValueAsString(p));
    }

    private void enviarErro(HttpExchange exchange, String erro) throws IOException {
        byte[] resp = erro.getBytes();
        exchange.getResponseHeaders().add("Content-Type", "application/json");
        exchange.sendResponseHeaders(400, resp.length);
        OutputStream os = exchange.getResponseBody();
        os.write(resp);
        os.close();
    }

    private void enviar(HttpExchange exchange, String resposta) throws IOException {
        exchange.getResponseHeaders().add("Content-Type", "application/json");
        exchange.sendResponseHeaders(200, resposta.getBytes().length);
        OutputStream os = exchange.getResponseBody();
        os.write(resposta.getBytes());
        os.close();
    }
}