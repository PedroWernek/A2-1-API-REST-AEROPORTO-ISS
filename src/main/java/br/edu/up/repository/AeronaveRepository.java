package br.edu.up.repository;

import br.edu.up.model.Aeronave;
import br.edu.up.model.Passageiro;
import br.edu.up.repository.connection.ConnectionFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;



//Comando para criar a tabela:
/*
    USE aeroporto;

  CREATE TABLE aeronave( // segunda tabela
    id VARCHAR(50) PRIMARY KEY,
    tipo VARCHAR(100) NOT NULL,
    capacidadeAssentos INT NOT NULL,
    modelo VARCHAR(50) NOT NULL

  );
* */

public class AeronaveRepository {


    public void salvar(Aeronave a) throws SQLException {

        //String com o script sql que será executado no banco
        String sql = "INSERT INTO aeronave (id, tipo, capacidadeAssentos, modelo) VALUES (?, ?, ?, ?)";

        //estou usando aquela fábrica já criada
        try (
                //pegando a conexão com o banco via ConnectionFactory
                Connection conn = ConnectionFactory.getConnection();

                //preparando a declaração que é o ‘script’ lá em cima
                //para que eu possa inserir as informações antes de mandar de volta
                PreparedStatement stmt = conn.prepareStatement(sql))
        {
            //inserindo as informações dentro dos ? na ‘string’ ‘script’
            stmt.setString(1, a.getId());//primeiro ?
            stmt.setString(2, a.getTipo());//segundo ?
            stmt.setInt(3, a.getCapacidadeAssentos());//terceiro ?
            stmt.setString(4, a.getModelo());//quarto ?

            //mandando as informações
            stmt.executeUpdate();
        }
    }

    public List<Aeronave> listar() throws SQLException {
        List<Aeronave> lista = new ArrayList<>();
        String sql = "SELECT * FROM Aeronave";

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);

             //mesma coisa de cima só que aqui eu juá executo a query e
             //já pego as informações para que eu possa preencher a lista
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                Aeronave p = new Aeronave(
                        rs.getString("id"),
                        rs.getString("tipo"),
                        rs.getInt("capacidadeAssentos"),
                        rs.getString("modelo")
                );
                lista.add(p);
            }

        }
        return lista;
    }

    public Aeronave buscarPorId(String id) throws SQLException {
        String sql = "SELECT * FROM aeronave WHERE id = ?";

        //mesma coisa dos de baixo
        try(Connection conn = ConnectionFactory.getConnection();
            PreparedStatement stmt = conn.prepareStatement(sql)){

            stmt.setString(1,id);

            //do mesmo jeito que eu "tento" a conexão eu tento ver se retorna
            try(ResultSet rs = stmt.executeQuery()) {
                if(rs.next()) {
                    return new Aeronave(
                        rs.getString("id"),
                        rs.getString("tipo"),
                        rs.getInt("capacidadeAssentos"),
                        rs.getString("modelo")
                    );
                }
            }
        }

        //se não retorno NULL
        return null;
    }

    public void atualizar(Aeronave a) throws SQLException {
        String sql = "UPDATE aeronave SET tipo = ?, capacidadeAssentos = ?, modelo = ? WHERE id = ?";

        try(Connection conn = ConnectionFactory.getConnection();
            PreparedStatement stmt = conn.prepareStatement(sql)){

            
            stmt.setString(1, a.getTipo());//primeiro ?
            stmt.setInt(2, a.getCapacidadeAssentos());//segundo ?
            stmt.setString(3, a.getModelo());//terceiro ?
             stmt.setString(4, a.getId());//quarto ?

            stmt.executeUpdate();
        }
    }

    public void deletar(String id) throws SQLException {
        String sql = "DELETE FROM aeronave WHERE id = ?";

        //mesma coisa dos de baixo
        try(Connection conn = ConnectionFactory.getConnection();
            PreparedStatement stmt = conn.prepareStatement(sql)){

            stmt.setString(1,id);

            stmt.executeUpdate();

        }
    }

}

