package br.edu.up.repository.connection;

import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import io.github.cdimascio.dotenv.Dotenv;

import java.sql.DriverManager;
import java.sql.SQLException;

public class RabbitMQConnection {
    private static String RABBITMQ_URL;

    //static para rodar só uma vez
    static {
        // 1. Primeiro tenta pegar as variáveis no Render
        RABBITMQ_URL = System.getenv("RABBITMQ_URL");

        // 2. Se a URL vier nula, rodando localmente (Localhost)
        if (RABBITMQ_URL == null) {
            System.out.println("Variáveis de ambiente não encontradas. Carregando do arquivo .env...");

            Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

            RABBITMQ_URL = dotenv.get("RABBITMQ_URL");
        }
    }
    public static Connection getConnection() throws Exception {
        ConnectionFactory factory = new ConnectionFactory();

        // CORREÇÃO: Usar setUri em vez de setHost para links completos!
        factory.setUri(RABBITMQ_URL);

        return factory.newConnection();
    }
}