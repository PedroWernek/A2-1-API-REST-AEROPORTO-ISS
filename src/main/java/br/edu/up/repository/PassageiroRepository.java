package br.edu.up.repository;

import br.edu.up.model.Passageiro;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;



//Comando para criar a tabela:
/*
    USE aeroporto;

    CREATE TABLE passageiro(
        id VARCHAR(50) PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        cpf VARCHAR(14) NOT NULL
    );
* */
public class PassageiroRepository {

    public void salvar(Passageiro p) throws SQLException {

        //String com o script sql que será executado no banco
        String sql = "INSERT INTO passageiro (id, nome, cpf) VALUES (?, ?, ?)";

        //estou usando aquela fabrica já criada
        try (
                //pegando a connexão com o banco via ConnectionFactory
                Connection conn = ConnectionFactory.getConnection();

                //preparando a declaração que é o script lá em cima
                //para que eu possa inserir as informações antes de mandar de volta
                PreparedStatement stmt = conn.prepareStatement(sql))
        {
            //inserindo as informações dentro dos ? na string script
            stmt.setString(1, p.getId());//primeiro ?
            stmt.setString(2, p.getNome());//segundo ?
            stmt.setString(3, p.getCpf());//terceiro ?

            //mandando as informações
            stmt.executeUpdate();
        }
    }

    public List<Passageiro> listar() throws SQLException {
        List<Passageiro> lista = new ArrayList<>();
        String sql = "SELECT * FROM passageiro";

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);

             //mesma coisa de cima só que aqui eu juá executo a quary e
             //já pego as informaç~eso para que eu possa preencher a lista
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                Passageiro p = new Passageiro(
                        rs.getString("id"),
                        rs.getString("nome"),
                        rs.getString("cpf")
                );
                lista.add(p);
            }

        }
        return lista;
    }
}

