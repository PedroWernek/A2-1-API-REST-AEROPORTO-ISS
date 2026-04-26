# API REST - Sistema de Gestão de Linhas Aéreas

## 1. Descrição do Sistema

## 2. Tecnologias Utilizadas
* **Linguagem:** Java 24
* **Arquitetura:** MVC (Model, View/JSON, Controller)
* **Comunicação:** HTTP / REST
* **Manipulação de Dados:** JSON (via biblioteca [Jackson](https://mvnrepository.com/artifact/com.fasterxml.jackson.core/jackson-core))
* **Persistência:** 
* **Banco de Dados:** 

## 3. Arquitetura e Padrões
O projeto possui as seguintes camadas rigorosamente separadas:
1. **Models:** Classes de entidade puro Java representando as regras de negócio e os dados (`Aeronave`, `Voo`, `Passageiro`, `Passagem`).
2. **Repositories:** Responsáveis exclusivos pela comunicação com o banco de dados (padrão Repository).
3. **Services:** Camada intermediária responsável por processar cálculos e aplicar as regras de negócio antes de interagir com o banco.
4. **Controllers:** Pontos de entrada da API, responsáveis por expor os Endpoints, receber as requisições HTTP, delegar o processamento aos *Services* e devolver as respostas em formato JSON.

## 4. Regras de Negócio Aplicadas
Para evitar um CRUD "vazio", o sistema aplica as seguintes regras corporativas:
* **Aeronaves:** Não é possível cadastrar uma aeronave com capacidade de assentos zerada ou negativa.
* **Voos:** Ao alocar um voo, a API valida se a aeronave designada existe e possui capacidade válida. A quantidade de assentos disponíveis no voo é espelhada automaticamente a partir da capacidade da aeronave.
* **Passagens (Associação N:N):** A passagem atua como a entidade associativa entre Voo e Passageiro. Ao emitir uma nova passagem, o sistema deve registrar o valor e atualizar o controle de assentos ocupados daquele voo.

## 5. Lista de Endpoints

Lista de endpoits usada para o teste da API.

### 5.1. Aeronaves (`/api/aeronaves`)
| Método | Rota | Descrição |
| :--- | :--- | :--- |
| **GET** | `/api/aeronaves` | Lista todas as aeronaves cadastradas. |
| **GET** | `/api/aeronaves/{id}` | Retorna os detalhes de uma aeronave específica pelo seu ID. |
| **POST** | `/api/aeronaves` | Cadastra uma nova aeronave. Requer JSON no *body*. |
| **PUT** | `/api/aeronaves/{id}` | Atualiza os dados de uma aeronave existente. |
| **DELETE** | `/api/aeronaves/{id}` | Remove uma aeronave do sistema. |

### 5.2. Voos (`/api/voos`)
| Método | Rota | Descrição |
| :--- | :--- | :--- |
| **GET** | `/api/voos` | Lista todos os voos programados. |
| **GET** | `/api/voos/{id}` | Retorna os detalhes de um voo específico pelo seu ID. |
| **POST** | `/api/voos` | Registra um novo voo associado a uma aeronave existente. Requer JSON no *body*. |
| **PUT** | `/api/voos/{id}` | Atualiza os dados de um voo existente (ex: alterar data ou destino). |
| **DELETE** | `/api/voos/{id}` | Remove um voo do sistema. |

### 5.3. Passageiros (`/api/passageiros`)
| Método | Rota | Descrição |
| :--- | :--- | :--- |
| **GET** | `/api/passageiros` | Lista todos os passageiros cadastrados. |
| **GET** | `/api/passageiros/{id}` | Retorna os detalhes de um passageiro específico pelo seu ID. |
| **POST** | `/api/passageiros` | Registra um novo cliente/passageiro. Requer JSON no *body*. |
| **PUT** | `/api/passageiros/{id}` | Atualiza os dados de um passageiro existente (ex: corrigir nome ou CPF). |
| **DELETE** | `/api/passageiros/{id}` | Remove um passageiro do sistema. |

### 5.4. Passagens (`/api/passagens`)
| Método | Rota | Descrição |
| :--- | :--- | :--- |
| **GET** | `/api/passagens` | Lista todas as passagens emitidas. |
| **GET** | `/api/passagens/{id}` | Retorna os detalhes de uma passagem específica pelo seu ID. |
| **POST** | `/api/passagens` | Emite uma nova passagem, vinculando um passageiro a um voo (Venda). Requer JSON no *body*. |
| **PUT** | `/api/passagens/{id}` | Atualiza os dados de uma passagem existente (ex: troca de assento). |
| **DELETE** | `/api/passagens/{id}` | Cancela e remove uma passagem do sistema. |