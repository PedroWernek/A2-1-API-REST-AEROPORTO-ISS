package br.edu.up.repository;

import br.edu.up.model.Passageiro;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class PassageiroRepository {

    public void salvar(Passageiro p) throws SQLException {
        String sql = "INSERT INTO passageiro (id, nome, cpf) VALUES (?, ?, ?)";

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql))
        {
            stmt.setString(1, p.getId());
            stmt.setString(2, p.getNome());
            stmt.setString(3, p.getCpf());
            stmt.executeUpdate();
        }
    }

    public List<Passageiro> listar() throws SQLException {
        List<Passageiro> lista = new ArrayList<>();
        String sql = "SELECT * FROM passageiro";

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
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

