package br.edu.up.repository;

import br.edu.up.model.Endereco;
import br.edu.up.model.Passageiro;
import br.edu.up.repository.connection.ConnectionFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class PassageiroRepository {

    public void salvar(Passageiro p) throws SQLException {
        String sql = "INSERT INTO passageiro (id, nome, cpf, endereco_id) VALUES (?, ?, ?, ?)";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, p.getId());
            stmt.setString(2, p.getNome());
            stmt.setString(3, p.getCpf());

            stmt.setString(4, p.getEndereco() != null ? p.getEndereco().getId() : null);
            stmt.executeUpdate();
        }
    }

    public void atualizar(Passageiro p) throws SQLException {
        String sql = "UPDATE passageiro SET nome = ?, cpf = ?, endereco_id = ? WHERE id = ?";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, p.getNome());
            stmt.setString(2, p.getCpf());
            stmt.setString(3, p.getEndereco() != null ? p.getEndereco().getId() : null);
            stmt.setString(4, p.getId());
            stmt.executeUpdate();
        }
    }

    public void deletar(String id) throws SQLException {
        String sql = "DELETE FROM passageiro WHERE id = ?";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, id);
            stmt.executeUpdate();
        }
    }

    public Passageiro buscarPorId(String id) throws SQLException {
        String sql = "SELECT * FROM passageiro WHERE id = ?";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) return mapearPassageiro(rs);
            }
        }
        return null;
    }

    public List<Passageiro> listar() throws SQLException {
        List<Passageiro> lista = new ArrayList<>();
        String sql = "SELECT * FROM passageiro";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) lista.add(mapearPassageiro(rs));
        }
        return lista;
    }

    private Passageiro mapearPassageiro(ResultSet rs) throws SQLException {
        Passageiro p = new Passageiro();
        p.setId(rs.getString("id"));
        p.setNome(rs.getString("nome"));
        p.setCpf(rs.getString("cpf"));

        String enderecoId = rs.getString("endereco_id");
        if (enderecoId != null) {
            Endereco e = new Endereco();
            e.setId(enderecoId);
            p.setEndereco(e);
        }
        return p;
    }
}