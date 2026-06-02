package br.edu.up.messaging;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.DeliverCallback;
import br.edu.up.repository.connection.RabbitMQConnection;

import java.nio.charset.StandardCharsets;

public class RabbitMQConsumer implements Runnable {
    private static final String QUEUE_NAME = "emissao_bilhetes";

    @Override
    public void run() {
        try {
            Connection connection = RabbitMQConnection.getConnection();
            Channel channel = connection.createChannel();

            channel.queueDeclare(QUEUE_NAME, false, false, false, null);
            System.out.println(" [*] Consumidor RabbitMQ a aguardar mensagens na fila '" + QUEUE_NAME + "'...");

            DeliverCallback deliverCallback = (consumerTag, delivery) -> {
                String message = new String(delivery.getBody(), StandardCharsets.UTF_8);
                System.out.println(" [x] Mensagem adicionada -> " + message);
            };

            channel.basicConsume(QUEUE_NAME, true, deliverCallback, consumerTag -> { });

        } catch (Exception e) {
            System.err.println("Erro ao iniciar o consumidor do RabbitMQ: " + e.getMessage());
        }
    }
}