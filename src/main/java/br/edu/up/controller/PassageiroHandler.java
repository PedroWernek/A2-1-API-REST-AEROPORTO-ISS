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


    //vendo qual requisição foi feita para que seja feita a operação
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

    /**Listando TODOS os passagerios da Tabela passageiro
     * não esqueça que a operação que faz a comunicação com o banco está no repository
     */
    private void listar(HttpExchange exchange) throws Exception {
        List<Passageiro> produtos = service.listarPassageiros();

        String json = mapper.writeValueAsString(produtos);//escrevendo a lista de passageiros como um json

        enviar(exchange, json); //<- *
    }

    /** Criando um novo passageiro no banco
     *
     *
     */
    private void criar(HttpExchange exchange) throws Exception {
        Passageiro p = mapper.readValue(exchange.getRequestBody(), Passageiro.class);
        //pegando o corpo da request que está em json
        //e transformando na classe Passageiro
        //para que assim seja possivel a função no repository
        //ler os valores de passageiro e mandar para o banco

        Passageiro criado = service.criarPassageiro(p);//salvando no banco
        String json = mapper.writeValueAsString(criado);//<- por isso a função do repository retorna um Passageiro
        //para que ele consiga ser lida pelo JACKSON e transformar o valor criado em json para que assim seja mandado ao usuário

        enviar(exchange, json);//<- *
    }


    // aquela função que a gente manda para o usuário se deu certo ou não está marcada com //<- *
    private void enviar(HttpExchange exchange, String resposta) throws IOException {
        exchange.getResponseHeaders().add("Content-Type", "application/json");
        exchange.sendResponseHeaders(200, resposta.getBytes().length);
        OutputStream os = exchange.getResponseBody();
        os.write(resposta.getBytes());
        os.close();
    }
}