package br.edu.up;


import br.edu.up.controller.PassageiroHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;
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

  );
* */



//Recomendo vocês usarem Postman para fazer as requisições
public class Main {
    public static void main(String[] args) throws Exception{
        HttpServer server = HttpServer.create(new InetSocketAddress(8000), 0);
        server.createContext("/passageiro", new PassageiroHandler());
        server.setExecutor(null);
        server.start();
        System.out.println("API rodando em http://localhost:8000");
    }
}