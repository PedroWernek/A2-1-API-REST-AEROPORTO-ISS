package br.edu.up;

import br.edu.up.controller.PassageiroHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;

public class Server {
    public static void run() throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(8000), 0);
        server.createContext("/passageiro", new PassageiroHandler());
        server.setExecutor(null);
        server.start();
        System.out.println("API rodando em http://localhost:8000/passageiro");
    }
}
