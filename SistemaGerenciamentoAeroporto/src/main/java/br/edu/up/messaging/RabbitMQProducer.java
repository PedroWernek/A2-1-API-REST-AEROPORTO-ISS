package br.edu.up.messaging;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import br.edu.up.repository.connection.RabbitMQConnection;

import java.nio.charset.StandardCharsets;

public class RabbitMQProducer {
    private static final String QUEUE_NAME = "emissao_bilhetes";

    public static void enviarMensagem(String mensagem) {
        try (Connection connection = RabbitMQConnection.getConnection();
             Channel channel = connection.createChannel()) {

            // Cria a fila se ela não existir
            channel.queueDeclare(QUEUE_NAME, true, false, false, null);

            // Publica a mensagem na fila
            channel.basicPublish("", QUEUE_NAME, null, mensagem.getBytes(StandardCharsets.UTF_8));
            System.out.println(" [x] Mensagem enviada para o RabbitMQ: '" + mensagem + "'");

        } catch (Exception e) {
            System.err.println("Erro ao enviar mensagem para o RabbitMQ: " + e.getMessage());
        }
    }
}