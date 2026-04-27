package br.edu.up.controller;

import br.edu.up.model.Passagem;
import br.edu.up.service.PassagemService;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

public class PassagemHandler implements HttpHandler {

    private final ObjectMapper mapper = new ObjectMapper();
    private final PassagemService service = new PassagemService();

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
	                if(id != null) atualizar(exchange,id);
	                else exchange.sendResponseHeaders(400,-1);
	                break;
	            case "DELETE":
	                if(id != null) deletar(exchange, id);
	                else exchange.sendResponseHeaders(400,-1);
	                break;
	            default:
	                exchange.sendResponseHeaders(405,-1); //Method Not Allowed
	        }

	    } catch (Exception e) {
	        enviarErro(exchange, e.getMessage());
	    }
        }

        private void listar(HttpExchange exchange) throws Exception {
	        List<Passagem> passagens = service.listarPassagens();

	        String json = mapper.writeValueAsString(passagens);

	        enviar(exchange, json); 
	    }

        private void criar(HttpExchange exchange) throws Exception {
	        Passagem pa = mapper.readValue(exchange.getRequestBody(), Passagem.class);
	
	        Passagem criada = service.criarPassagem(pa);
	        String json = mapper.writeValueAsString(criada);

	        enviar(exchange, json);
	    }

        private void buscar(HttpExchange exchange, String id) throws Exception {
	        Passagem pa = service.buscarPassagemPorId(id);
	        enviar(exchange, mapper.writeValueAsString(pa));
	    }

        private void atualizar(HttpExchange exchange, String id) throws Exception {
	        Passagem pa = mapper.readValue(exchange.getRequestBody(), Passagem.class); // pegando o valor da request body
	        Passagem atualizada = service.atualizarPassagem(id,pa);
	        enviar(exchange, mapper.writeValueAsString(atualizada));
	    }

        private void deletar(HttpExchange exchange, String id) throws Exception {
	        Passagem pa = service.deletarPassagem(id);
	        enviar(exchange, mapper.writeValueAsString(pa));
	    }

        private void enviarErro(HttpExchange exchange, String erro) throws IOException {
	        byte[] resp = erro.getBytes();
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
