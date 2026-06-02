package br.edu.up;

import java.io.IOException;
import java.net.InetSocketAddress;

import br.edu.up.messaging.RabbitMQConsumer;
import com.sun.net.httpserver.Filter;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import br.edu.up.controller.AeronaveHandler;
import br.edu.up.controller.PassageiroHandler;
import br.edu.up.controller.PassagemHandler;
import br.edu.up.controller.VooHandler;

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

        server.createContext("/passageiro", new PassageiroHandler()).getFilters().add(corsFilter);
        server.createContext("/aeronave", new AeronaveHandler()).getFilters().add(corsFilter);
        server.createContext("/voo", new VooHandler()).getFilters().add(corsFilter);
        server.createContext("/passagem", new PassagemHandler()).getFilters().add(corsFilter);
        
        server.setExecutor(null);
        server.start();
        System.out.println("http://localhost:" + port);

        // Iniciar o Consumer em segundo plano depois de iniciar o server: é como se eu tivesse ligado uma segunda main

        //link para ver as filas: https://jaragua.lmq.cloudamqp.com/queues#page=1&page_size=100
        Thread consumerThread = new Thread(new RabbitMQConsumer());
        consumerThread.start();
    }
}