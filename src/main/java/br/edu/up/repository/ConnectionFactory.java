package br.edu.up.repository;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConnectionFactory {
    //que nem a connection String do C# aqui é aonde a gente se conecta com
    //o banco de dados (estamos usando um banco SQL com SBGD MySQL
    private static final String URL = "jdbc:mysql://localhost:3306/aeroporto";
    private static final String USER = "root";
    private static final String PASSWORD = "1234";

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}
