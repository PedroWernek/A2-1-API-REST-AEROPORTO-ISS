package br.edu.up;


import br.edu.up.controller.PassageiroHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;

//Criem o bd Aeroporto
//CREATE DATABASE aeroporto;

//Criem as tabelas
/*
* CREATE TABLE passageiro( //essa é a primeira tabela que criei por enquanto
    id VARCHAR(50) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL
  );
* */
//Recomendo vocês usarem Postgress para fazer as requisições
public class Main {
    public static void main(String[] args) throws Exception{
        HttpServer server = HttpServer.create(new InetSocketAddress(8000), 0);
        server.createContext("/passageiro", new PassageiroHandler());
        server.setExecutor(null);
        server.start();
        System.out.println("API rodando em http://localhost:8000");
    }
}