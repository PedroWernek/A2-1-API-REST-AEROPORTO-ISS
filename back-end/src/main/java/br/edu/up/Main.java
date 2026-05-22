package br.edu.up;


import br.edu.up.controller.AeronaveHandler;
import br.edu.up.controller.PassageiroHandler;
import br.edu.up.controller.PassagemHandler;
import br.edu.up.controller.VooHandler;
import com.sun.net.httpserver.HttpServer;
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
        // Pega a porta do Render ou usa 8000 se for no seu computador
        String portStr = System.getenv("PORT");
        int port = (portStr != null) ? Integer.parseInt(portStr) : 8000;

        // "0.0.0.0" permite que a internet chegue no seu backend
        HttpServer server = HttpServer.create(new InetSocketAddress("0.0.0.0", port), 0);
        server.createContext("/passageiro", new PassageiroHandler());
        server.createContext("/aeronave", new AeronaveHandler());
        server.createContext("/voo", new VooHandler());
        server.createContext("/passagem", new PassagemHandler());
        server.setExecutor(null);
        server.start();
        System.out.println("API rodando na porta: " + port);
    }
}