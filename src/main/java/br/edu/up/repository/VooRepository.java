package br.edu.up.repository;

import br.edu.up.model.Aeronave;
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

CREATE TABLE voo (
    id VARCHAR(50) PRIMARY KEY,
    origem VARCHAR(100) NOT NULL,
    destino VARCHAR(100) NOT NULL,
    dataHoraVoo VARCHAR(50) NOT NULL,
    assentosDisponiveis INT,
    FOREIGN KEY (aeronaveId) REFERENCES aeronave(id)

);
* */


public class VooRepository {
	
	
	public void salvar(Voo v) throws SQLException {

        //String com o script sql que será executado no banco
        String sql = "INSERT INTO voo (id, origem, destino, dataHoraVoo, assentosDisponiveis, aeronave_id) VALUES (?, ?, ?, ?, ?, ?)";

        //estou usando aquela fábrica já criada
        try (
                //pegando a conexão com o banco via ConnectionFactory
                Connection conn = ConnectionFactory.getConnection();

                //preparando a declaração que é o ‘script’ lá em cima
                //para que eu possa inserir as informações antes de mandar de volta
                PreparedStatement stmt = conn.prepareStatement(sql))
        {
            //inserindo as informações dentro dos ? na ‘string’ ‘script’
        	stmt.setString(1, v.getId());
            stmt.setString(2, v.getOrigem());
            stmt.setString(3, v.getDestino());
            stmt.setString(4, v.getDataHoraVoo());
            stmt.setInt(5, v.getAssentosDisponiveis());
            stmt.setString(6, v.getAeronave().getId());

            //mandando as informações
            stmt.executeUpdate();
        }
    }

	public List<Voo> listar() throws SQLException {
        List<Voo> lista = new ArrayList<>();
        String sql = "SELECT * FROM voo";

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);

             //mesma coisa de cima só que aqui eu já executo a query e
             //já pego as informações para que eu possa preencher a lista
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                //busca a aeronave pelo id no banco, e joga o objeto dela dentro de "aero"
                Aeronave aero = buscarAeronaveVoo(rs.getString("aeronave_id"));

                Voo p = new Voo(
                        rs.getString("id"),
                        rs.getString("origem"),
                        rs.getString("destino"),
                        rs.getString("dataHoraVoo"),
                        rs.getInt("assentosDisponiveis"),
                        //consigo instanciar a aeronave agora, pq "Voo" espera receber um objeto aeronave completo, n só o ID
                        aero 
                );
                lista.add(p);
            }

        }
        return lista;
    }

   
	public Voo buscarPorId(String id) throws SQLException {
        String sql = "SELECT * FROM voo WHERE id = ?";
        
      //mesma coisa dos de baixo
        try(Connection conn = ConnectionFactory.getConnection();
            PreparedStatement stmt = conn.prepareStatement(sql)){
        	
            stmt.setString(1, id);
            
          //do mesmo jeito que eu "tento" a conexão eu tento ver se retorna
            try(ResultSet rs = stmt.executeQuery()) {
                if(rs.next()) {
                    //pra buscar o voo e trazer o objeto correto de aeronave, estou dizendo que "aero" vai receber o resultado do método "buscarAeronaveVoo"
                    Aeronave aero = buscarAeronaveVoo(rs.getString("aeronave_id"));
                    return new Voo(
                        rs.getString("id"),
                        rs.getString("origem"),
                        rs.getString("destino"),
                        rs.getString("dataHoraVoo"),
                        rs.getInt("assentosDisponiveis"),
                        aero
                    );
                }
            }
        }
        return null;
    }
	
	//criado esse método auxiliar pra conseguir buscar a aeronave correspondente ao voo
	private Aeronave buscarAeronaveVoo(String idAeronave) throws SQLException {
        String sql = "SELECT * FROM aeronave WHERE id = ?";
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, idAeronave);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return new Aeronave(
                            rs.getString("id"),
                            rs.getString("tipo"),
                            rs.getInt("capacidadeAssentos"),
                            rs.getString("modelo")
                    );
                }
            }
        }
        return null;
    }

    public void atualizar(Voo v) throws SQLException {
        String sql = "UPDATE voo SET origem = ?, destino = ?, dataHoraVoo = ?, assentosDisponiveis = ?, aeronave_id = ? WHERE id = ?";

        try(Connection conn = ConnectionFactory.getConnection();
            PreparedStatement stmt = conn.prepareStatement(sql)){

            
            stmt.setString(1, v.getOrigem());//primeiro ?
            stmt.setString(2, v.getDestino());//segundo ?
            stmt.setString(3, v.getDataHoraVoo());//terceiro ?
            stmt.setInt(4, v.getAssentosDisponiveis());//quarto ?
            stmt.setString(5, v.getAeronave().getId());//quinto ?
            stmt.setString(6, v.getId());//sexto ?

            stmt.executeUpdate();
        }
    }

    public void deletar(String id) throws SQLException {
        String sql = "DELETE FROM voo WHERE id = ?";

        //mesma coisa dos de baixo
        try(Connection conn = ConnectionFactory.getConnection();
            PreparedStatement stmt = conn.prepareStatement(sql)){

            stmt.setString(1,id);

            stmt.executeUpdate();

        }
    }
}