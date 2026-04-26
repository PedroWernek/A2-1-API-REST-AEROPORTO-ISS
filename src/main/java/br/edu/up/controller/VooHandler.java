package br.edu.up.controller;

import br.edu.up.model.Passageiro;
import br.edu.up.model.Voo;
import br.edu.up.service.PassageiroService;
import br.edu.up.service.VooService;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

public class VooHandler implements HttpHandler {
	
	 private final ObjectMapper mapper = new ObjectMapper();
	    private final VooService service = new VooService();
	    
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
		
		/**Listando TODOS os voos da Tabela voo
	     * não esqueça que a operação que faz a comunicação com o banco está no repository
	     */
	    private void listar(HttpExchange exchange) throws Exception {
	        List<Voo> produtos = service.listarVoos();

	        String json = mapper.writeValueAsString(produtos);//escrevendo a lista de voos como um json

	        enviar(exchange, json); //<- *
	    }

	    /** Criando um voo no banco
	     *
	     *
	     */
	    private void criar(HttpExchange exchange) throws Exception {
	        Voo p = mapper.readValue(exchange.getRequestBody(), Voo.class);
	        //pegando o corpo da request que está em json
	        //e transformando na classe Voo
	        //para que assim seja possível a função no repository
	        //ler os valores de voo e mandar para o banco

	        Voo criado = service.criarVoo(p);//salvando no banco
	        String json = mapper.writeValueAsString(criado);//< por isso a função do repository retorna um Voo
	        //para que ele consiga ser lida pelo JACKSON e transformar o valor criado em json para que assim seja mandado ao usuário

	        enviar(exchange, json);//<- *
	    }


	    private void buscar(HttpExchange exchange, String id) throws Exception {
	        Voo p = service.buscarVooPorId(id);
	        enviar(exchange, mapper.writeValueAsString(p));
	    }

	    private void atualizar(HttpExchange exchange, String id) throws Exception {
	        Voo p = mapper.readValue(exchange.getRequestBody(), Voo.class); // pegando o valor da request body
	        Voo atualizado = service.atualizarVoo(id,p);
	        enviar(exchange, mapper.writeValueAsString(atualizado));
	    }

	    private void deletar(HttpExchange exchange, String id) throws Exception {
	        Voo p = service.deletarVoo(id);
	        enviar(exchange, mapper.writeValueAsString(p));
	    }

	    //----------------------------------Mensagens de Retorno------------------------------------------//
	    private void enviarErro(HttpExchange exchange, String erro) throws IOException {
	        byte[] resp = erro.getBytes();
	        exchange.sendResponseHeaders(400, resp.length);
	        OutputStream os = exchange.getResponseBody();
	        os.write(resp);
	        os.close();
	    }

	    // aquela função que a gente manda para o utilizador se deu certo ou não está marcada com //<- *
	    private void enviar(HttpExchange exchange, String resposta) throws IOException {
	        exchange.getResponseHeaders().add("Content-Type", "application/json");
	        exchange.sendResponseHeaders(200, resposta.getBytes().length);
	        OutputStream os = exchange.getResponseBody();
	        os.write(resposta.getBytes());
	        os.close();
	    }

}
