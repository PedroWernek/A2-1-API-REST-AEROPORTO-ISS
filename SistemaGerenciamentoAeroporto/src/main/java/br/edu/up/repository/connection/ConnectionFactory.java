package br.edu.up.repository.connection;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import io.github.cdimascio.dotenv.Dotenv;

public class ConnectionFactory {
    private static String URL;
    private static String USER;
    private static String PASSWORD;

    //static para rodar só uma vez
    static {
        // 1. Primeiro tenta pegar as variáveis no Render
        URL = System.getenv("DB_URL");
        USER = System.getenv("DB_USER");
        PASSWORD = System.getenv("DB_PASSWORD");

        // 2. Se a URL vier nula, rodando localmente (Localhost)
        if (URL == null) {
            System.out.println("Variáveis de ambiente não encontradas. Carregando do arquivo .env...");

            Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

            URL = dotenv.get("DB_URL");
            USER = dotenv.get("DB_USER");
            PASSWORD = dotenv.get("DB_PASSWORD");
        }
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}