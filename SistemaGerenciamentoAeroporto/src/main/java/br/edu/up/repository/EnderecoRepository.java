package br.edu.up.repository;

import br.edu.up.model.Endereco;
import br.edu.up.repository.connection.ConnectionFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class EnderecoRepository {

    public void salvar(Endereco e) throws SQLException {

        String sql = "INSERT INTO endereco (id, cep, logradouro, bairro, localidade, uf)  VALUES (?, ?, ?, ?, ?, ?)";

        try (
                Connection conn = ConnectionFactory.getConnection();
                PreparedStatement stmt = conn.prepareStatement(sql)
            )
        {

            stmt.setString(1, e.getId());
            stmt.setString(2, e.getCep());
            stmt.setString(3, e.getLogradouro());
            stmt.setString(4, e.getBairro());
            stmt.setString(5, e.getLocalidade());
            stmt.setString(6, e.getUf());


            stmt.executeUpdate();
        }
    }

    /*
    public Endereco buscarPorId(String id) throws SQLException {
        String sql = "SELECT * FROM passageiro WHERE id = ?";


        try(Connection conn = ConnectionFactory.getConnection();
            PreparedStatement stmt = conn.prepareStatement(sql)){

            stmt.setString(1,id);

            try(ResultSet rs = stmt.executeQuery()) {
                if(rs.next()) {
                    return new Endereco(
                            rs.getString( "id" )
                            rs.getString( "cep" )
                            rs.getString( "logradouro" )
                            rs.getString( "bairro" )
                            rs.getString( "localidade" )
                            rs.getString( "uf" )
                    );
                }
            }
        }

        return null;
    }
    */

    public void atualizar(Endereco e) throws SQLException {
        String sql = "UPDATE passageiro SET id = ? , cep = ? , logradouro = ? , bairro = ? , localidade = ? , uf = ? , WHERE id = ?";

        try(Connection conn = ConnectionFactory.getConnection();
            PreparedStatement stmt = conn.prepareStatement(sql)){

            stmt.setString(1, e.getId());
            stmt.setString(2, e.getCep());
            stmt.setString(3, e.getLogradouro());
            stmt.setString(4, e.getBairro());
            stmt.setString(5, e.getLocalidade());
            stmt.setString(6, e.getUf());

            stmt.executeUpdate();
        }
    }

    public void deletar(String id) throws SQLException {
        String sql = "DELETE FROM endereco WHERE id = ?";

        try(Connection conn = ConnectionFactory.getConnection();
            PreparedStatement stmt = conn.prepareStatement(sql)){

            stmt.setString(1,id);

            stmt.executeUpdate();

        }
    }
}

