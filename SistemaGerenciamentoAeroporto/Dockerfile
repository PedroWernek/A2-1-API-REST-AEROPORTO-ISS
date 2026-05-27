# Estágio 1: Build (Gera o arquivo .jar usando Maven)
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean compile assembly:single

# Estágio 2: Run (Roda o servidor Java)
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/SistemaGerenciamentoAeroporto-1.0-SNAPSHOT-jar-with-dependencies.jar ./app.jar

# Comando para iniciar o servidor
CMD ["java", "-jar", "app.jar"]