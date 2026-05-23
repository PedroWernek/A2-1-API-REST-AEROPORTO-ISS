package br.edu.up;

import java.io.IOException;
import java.net.InetSocketAddress;

import com.sun.net.httpserver.Filter;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import br.edu.up.controller.AeronaveHandler;
import br.edu.up.controller.PassageiroHandler;
import br.edu.up.controller.PassagemHandler;
import br.edu.up.controller.VooHandler;

//Importem em seu mySQL o
//'aeroporto_passageiro.sql'
//que é ondem está nossa base
//no nosso repositório

//Para criar tabelas:
/*
* CREATE TABLE passageiro( //essa é a primeira tabela que criei por enquanto
    id VARCHAR(50) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL
  );

 CREATE TABLE aeronave( // segunda tabela
    id VARCHAR(50) PRIMARY KEY,
    tipo VARCHAR(100) NOT NULL,
    capacidadeAssentos INT NOT NULL,
    modelo VARCHAR(50) NOT NULL

  );
  

CREATE TABLE voo (
    id VARCHAR(50) PRIMARY KEY,
    origem VARCHAR(100) NOT NULL,
    destino VARCHAR(100) NOT NULL,
    dataHoraVoo VARCHAR(50) NOT NULL,
    assentosDisponiveis INT,
    FOREIGN KEY (id) REFERENCES aeronave(id)

);


* */



//Recomendo vocês usarem Postman para fazer as requisições
public class Main {
    public static void main(String[] args) throws Exception{
        String portStr = System.getenv("PORT");
        int port = (portStr != null) ? Integer.parseInt(portStr) : 8000;

        HttpServer server = HttpServer.create(new InetSocketAddress("0.0.0.0", port), 0);

        // O filtro mágico que diz para o navegador: "Pode deixar o Front-end acessar!
        Filter corsFilter = new Filter() {
            @Override
            public void doFilter(HttpExchange exchange, Chain chain) throws IOException {
                // Adiciona os headers de permissão em TODA resposta
                exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
                exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
                exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type, Authorization");

                // SE a requisição for do tipo OPTIONS (pré-voo do navegador), 
                // responda com sucesso (204) e encerre aqui, não tente processar o JSON.
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    exchange.sendResponseHeaders(204, -1);
                    return;
                }
                
                chain.doFilter(exchange);
            }

            @Override
            public String description() {
                return "CORS Filter";
            }
        };

        // Adicionamos o filtro em todas as rotas do seu sistema
        server.createContext("/passageiro", new PassageiroHandler()).getFilters().add(corsFilter);
        server.createContext("/aeronave", new AeronaveHandler()).getFilters().add(corsFilter);
        server.createContext("/voo", new VooHandler()).getFilters().add(corsFilter);
        server.createContext("/passagem", new PassagemHandler()).getFilters().add(corsFilter);
        
        server.setExecutor(null);
        server.start();
        System.out.println("API rodando na porta: " + port);
    }
}