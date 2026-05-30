package br.edu.up.repository;

import br.edu.up.model.Endereco;
import br.edu.up.repository.connection.ConnectionFactory; // Ajuste o import se necessário

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class EnderecoRepository {

    public void salvar(Endereco e) throws SQLException {
        String sql = "INSERT INTO endereco (id, cep, logradouro, bairro, localidade, uf) VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, e.getId());
            stmt.setString(2, e.getCep());
            stmt.setString(3, e.getLogradouro());
            stmt.setString(4, e.getBairro());
            stmt.setString(5, e.getLocalidade());
            stmt.setString(6, e.getUf());
            stmt.executeUpdate();
        }
    }

    public Endereco buscarPorId(String id) throws SQLException {
        String sql = "SELECT * FROM endereco WHERE id = ?";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Endereco e = new Endereco();
                    e.setId(rs.getString("id"));
                    e.setCep(rs.getString("cep"));
                    e.setLogradouro(rs.getString("logradouro"));
                    e.setBairro(rs.getString("bairro"));
                    e.setLocalidade(rs.getString("localidade"));
                    e.setUf(rs.getString("uf"));
                    return e;
                }
            }
        }
        return null;
    }

    public void atualizar(Endereco e) throws SQLException {
        String sql = "UPDATE endereco SET cep = ?, logradouro = ?, bairro = ?, localidade = ?, uf = ? WHERE id = ?";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, e.getCep());
            stmt.setString(2, e.getLogradouro());
            stmt.setString(3, e.getBairro());
            stmt.setString(4, e.getLocalidade());
            stmt.setString(5, e.getUf());
            stmt.setString(6, e.getId());
            stmt.executeUpdate();
        }
    }

    public void deletar(String id) throws SQLException {
        String sql = "DELETE FROM endereco WHERE id = ?";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, id);
            stmt.executeUpdate();
        }
    }
}