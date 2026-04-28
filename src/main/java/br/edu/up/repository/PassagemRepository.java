package br.edu.up.repository;

import br.edu.up.model.Passageiro;
import br.edu.up.model.Passagem;
import br.edu.up.model.Voo;
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

  CREATE TABLE passagem(
    id VARCHAR(50) PRIMARY KEY,
    assento VARCHAR(50) NOT NULL,
    valor DOUBLE NOT NULL,

    voo_id VARCHAR(50) NOT NULL,
    passageiro_id VARCHAR(50) NOT NULL

  );
* */

public class PassagemRepository {

    public void salvar(Passagem pa) throws SQLException {
        String sql = "INSERT INTO passagem (id, assento, valor, voo_id, passageiro_id) VALUES (?, ?, ?, ?, ?)";
        
        try (
            Connection conn = ConnectionFactory.getConnection();

            PreparedStatement stmt = conn.prepareStatement(sql)
        )
        {
            stmt.setString(1, pa.getId());
            stmt.setString(2, pa.getAssento());
            stmt.setDouble(3, pa.getValor());
            stmt.setString(4, pa.getVoo().getId());
            stmt.setString(5, pa.getPassageiro().getId());

            stmt.executeUpdate();
        }
    }

    public List<Passagem> listar() throws SQLException {
        List <Passagem> lista = new ArrayList<>();
        String sql = "SELECT * FROM Passagem";

        try (Connection conn = ConnectionFactory.getConnection();
    
            PreparedStatement stmt = conn.prepareStatement(sql);

            ResultSet rs = stmt.executeQuery()
        
        )
        {
            while (rs.next()){


                VooRepository vooRepository = new VooRepository();
                Voo voo = vooRepository.buscarPorId(rs.getString("voo_id"));

                PassageiroRepository passageiroRepository = new PassageiroRepository();
                Passageiro passageiro = passageiroRepository.buscarPorId(rs.getString("passageiro_id"));

                Passagem pa = new Passagem(
                    rs.getString("id"),
                    rs.getString("assento"),
                    rs.getDouble("valor"),
                    voo,
                    passageiro
                );
                lista.add(pa);
            }
        }
        return lista;
    }

    public Passagem buscarPorId(String id) throws SQLException {
        String sql = "SELECT * FROM passagem WHERE id = ?";

        try(Connection conn = ConnectionFactory.getConnection();
            PreparedStatement stmt = conn.prepareStatement(sql)){
        	
            stmt.setString(1, id);

            try(ResultSet rs = stmt.executeQuery()){
                if(rs.next()){
                    VooRepository vooRepository = new VooRepository();
                    Voo voo = vooRepository.buscarPorId(rs.getString("voo_id"));

                    PassageiroRepository passageiroRepository = new PassageiroRepository();
                    Passageiro passageiro = passageiroRepository.buscarPorId(rs.getString("passageiro_id"));

                    return new Passagem(
                        rs.getString("id"),
                        rs.getString("assento"),
                        rs.getDouble("valor"),
                        voo,
                        passageiro
                    );
                }
            }
    }

    return null;

}

public void atualizar(Passagem pa) throws SQLException {
    String sql = "UPDATE Passagem SET assento = ?, valor = ?, voo_id = ?, passageiro_id = ? WHERE id = ?";

    try(Connection conn = ConnectionFactory.getConnection();
        PreparedStatement stmt = conn.prepareStatement(sql))
        {
            stmt.setString(1, pa.getId());
            stmt.setString(2, pa.getAssento());
            stmt.setDouble(3, pa.getValor());
            stmt.setString(4, pa.getVoo().getId());
            stmt.setString(5, pa.getPassageiro().getId());

            stmt.executeUpdate();
        }
            
} 

public void deletar(String id) throws SQLException {
    String sql = "DELETE FROM Passagem WHERE id = ?";

    try(Connection conn = ConnectionFactory.getConnection();
        PreparedStatement stmt = conn.prepareStatement(sql)){
            stmt.setString(1, id);

            stmt.executeUpdate();
        }

}

}