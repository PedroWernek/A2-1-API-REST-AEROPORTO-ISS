# API REST - Sistema de Gestão de Linhas Aéreas

## 1. Descrição do Sistema
Esta é uma API REST desenvolvida em Java puro (sem o uso de frameworks pesados como o Spring Boot) para o gerenciamento de uma companhia aérea/aeroporto. O sistema permite o cadastro e controle de aeronaves, agendamento de voos, registro de passageiros e a emissão de passagens aéreas. O foco do projeto é aplicar os conceitos de arquitetura MVC, separação de responsabilidades e manipulação de banco de dados relacional através de requisições HTTP.

## 2. Tecnologias Utilizadas
* **Linguagem:** Java 24
* **Servidor Web:** `com.sun.net.httpserver.HttpServer` nativo do Java
* **Arquitetura:** MVC (Model, View/JSON, Controller)
* **Comunicação:** HTTP / REST
* **Manipulação de Dados:** JSON (via biblioteca [Jackson](https://mvnrepository.com/artifact/com.fasterxml.jackson.core/jackson-core))
* **Persistência:** JDBC (Java Database Connectivity) Nativo com `PreparedStatement`
* **Banco de Dados:** MySQL

## 3. Arquitetura e Padrões
O projeto possui as seguintes camadas separadas:
1. **Models:** Classes de entidade puro Java representando as regras de negócio e os dados (`Aeronave`, `Voo`, `Passageiro`, `Passagem`).
2. **Repositories:** Responsáveis exclusivos pela comunicação direta com o banco de dados via scripts SQL (padrão Repository).
3. **Services:** Camada intermediária responsável por processar validações e aplicar as regras de negócio antes de interagir com o repositório.
4. **Controllers (Handlers):** Pontos de entrada da API, responsáveis por expor os Endpoints, receber as requisições HTTP, delegar o processamento aos *Services* e devolver as respostas ao cliente em formato JSON.

## 4. Regras de Negócio Aplicadas
Para evitar um CRUD "vazio", o sistema aplica as seguintes regras corporativas:
* **Aeronaves:** Não é possível cadastrar uma aeronave com capacidade de assentos zerada, negativa ou maior que 1000. O tipo da aeronave também não pode ser "Militar" ou "Guerra".
* **Voos:** Ao alocar um voo, a API valida se a aeronave designada existe. A quantidade de assentos não pode ser menor que zero.
* **Passagens (Associação N:N):** A passagem atua como a entidade associativa entre Voo e Passageiro. Ao emitir uma nova passagem, a API valida se passageiro e voo existem. Além disso, o sistema deduz automaticamente `1` assento disponível no voo correspondente. Caso a passagem seja deletada, o assento retorna para o voo. 

## 5. Como Executar o Projeto

1. **Configuração do Banco de Dados:**
   * Crie um banco de dados no MySQL chamado `aeroporto`.
   * Importe os arquivos `.sql` fornecidos na raiz do projeto (como `aeroporto_aeronave.sql`, `aeroporto_voo.sql`, etc.) para criar as tabelas necessárias.
   * Certifique-se de que a tabela `voo` possui a coluna `aeronave_id` como chave estrangeira.

2. **Configuração da Conexão:**
   * Abra o arquivo `src/main/java/br/edu/up/repository/connection/ConnectionFactory.java`.
   * Verifique se as constantes `USER` e `PASSWORD` estão de acordo com as credenciais do seu banco MySQL local. (O padrão do código está `root` e `123456`).

3. **Iniciando o Servidor:**
   * Execute a classe `Main.java`.
   * Você verá no console a mensagem: `API rodando em http://localhost:8000`

## 6. Lista de Endpoints

Recomenda-se a utilização de ferramentas como **Postman** ou **Insomnia** para realizar o teste dos endpoints. A API roda na porta `:8000`.

### 6.1. Aeronaves (`/aeronave`)
| Método | Rota | Descrição |
| :--- | :--- | :--- |
| **GET** | `/aeronave` | Lista todas as aeronaves cadastradas. |
| **GET** | `/aeronave/{id}` | Retorna os detalhes de uma aeronave específica pelo seu ID. |
| **POST** | `/aeronave` | Cadastra uma nova aeronave. Requer JSON no *body*. |
| **PUT** | `/aeronave/{id}` | Atualiza os dados de uma aeronave existente. |
| **DELETE** | `/aeronave/{id}` | Remove uma aeronave do sistema. |

### 6.2. Voos (`/voo`)
| Método | Rota | Descrição |
| :--- | :--- | :--- |
| **GET** | `/voo` | Lista todos os voos programados. |
| **GET** | `/voo/{id}` | Retorna os detalhes de um voo específico pelo seu ID. |
| **POST** | `/voo` | Registra um novo voo associado a uma aeronave existente. Requer JSON no *body*. |
| **PUT** | `/voo/{id}` | Atualiza os dados de um voo existente. |
| **DELETE** | `/voo/{id}` | Remove um voo do sistema. |

### 6.3. Passageiros (`/passageiro`)
| Método | Rota | Descrição |
| :--- | :--- | :--- |
| **GET** | `/passageiro` | Lista todos os passageiros cadastrados. |
| **GET** | `/passageiro/{id}` | Retorna os detalhes de um passageiro específico pelo seu ID. |
| **POST** | `/passageiro` | Registra um novo cliente/passageiro. Requer JSON no *body*. |
| **PUT** | `/passageiro/{id}` | Atualiza os dados de um passageiro existente. |
| **DELETE** | `/passageiro/{id}` | Remove um passageiro do sistema. |

### 6.4. Passagens (`/passagem`)
| Método | Rota | Descrição |
| :--- | :--- | :--- |
| **GET** | `/passagem` | Lista todas as passagens emitidas. |
| **GET** | `/passagem/{id}` | Retorna os detalhes de uma passagem específica pelo seu ID. |
| **POST** | `/passagem` | Emite uma nova passagem, vinculando um passageiro a um voo (Venda). Requer JSON no *body*. |
| **PUT** | `/passagem/{id}` | Atualiza os dados de uma passagem existente (ex: troca de assento). |
| **DELETE** | `/passagem/{id}` | Cancela e remove uma passagem do sistema, devolvendo o assento ao voo. |
