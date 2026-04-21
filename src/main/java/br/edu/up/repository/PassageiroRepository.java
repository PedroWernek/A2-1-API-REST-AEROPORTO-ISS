package br.edu.up.repository;

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

        //estou usando aquela fábrica já criada
        try (
                //pegando a conexão com o banco via ConnectionFactory
                Connection conn = ConnectionFactory.getConnection();

                //preparando a declaração que é o ‘script’ lá em cima
                //para que eu possa inserir as informações antes de mandar de volta
                PreparedStatement stmt = conn.prepareStatement(sql))
        {
            //inserindo as informações dentro dos ? na ‘string’ ‘script’
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

             //mesma coisa de cima só que aqui eu juá executo a query e
             //já pego as informações para que eu possa preencher a lista
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

    public Passageiro buscarPorId(String id) throws SQLException {
        String sql = "SELECT FROM passageiro WHERE id = ?";

        //mesma coisa dos de baixo
        try(Connection conn = ConnectionFactory.getConnection();
            PreparedStatement stmt = conn.prepareStatement(sql)){

            stmt.setString(1,id);

            //do mesmo jeito que eu "tento" a conexão eu tento ver se retorna
            try(ResultSet rs = stmt.executeQuery()) {
                if(rs.next()) {
                    return new Passageiro(
                            rs.getString("id"),
                            rs.getString("nome"),
                            rs.getString("cpf")
                    );
                }
            }
        }

        //se não retorno NULL
        return null;
    }

    public void atualizar(Passageiro p) throws SQLException {
        String sql = "UPDATE passageiro SET nome = ?, cpf = ? WHERE id = ?";

        try(Connection conn = ConnectionFactory.getConnection();
            PreparedStatement stmt = conn.prepareStatement(sql)){

            stmt.setString(1, p.getId());
            stmt.setString(2, p.getNome());
            stmt.setString(3, p.getCpf());

            stmt.executeUpdate();
        }
    }

    public void deletar(String id) throws SQLException {
        String sql = "DELETE FROM passageiro WHERE id = ?";

        //mesma coisa dos de baixo
        try(Connection conn = ConnectionFactory.getConnection();
            PreparedStatement stmt = conn.prepareStatement(sql)){

            stmt.setString(1,id);

            stmt.executeUpdate();

        }
    }

}

