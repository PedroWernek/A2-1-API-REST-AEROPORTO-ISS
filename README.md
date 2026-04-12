# API REST - Sistema de Gestão de Linhas Aéreas

## 1. Descrição do Sistema
Este projeto é uma API RESTful desenvolvida para a disciplina de Integração de Sistemas de Software (Avaliação A2-1). O sistema tem como objetivo gerenciar as operações básicas de uma companhia aérea, controlando o registro de **Aeronaves** e a programação de **Voos**.

O projeto original (baseado em arquivos CSV e menus de console) foi totalmente refatorado para operar como um serviço web, focando em separação de responsabilidades, regras de negócio reais e persistência de dados em banco de dados relacional.

## 2. Tecnologias Utilizadas
* **Linguagem:** Java
* **Arquitetura:** MVC
* **Comunicação:** HTTP / REST
* **Manipulação de Dados:** JSON (via biblioteca [Jackson](https://mvnrepository.com/artifact/com.fasterxml.jackson.core/jackson-core))
* **Persistência:** 
* **Banco de Dados:**

## 3. Arquitetura e Padrões
O projeto possui as seguintes camadas:
1. **Models:** Classes de entidade puro Java representando as regras de negócio e os dados (`Aeronave`, `Voo`).
4. **Controllers:** Pontos de entrada da API, responsáveis por expor os Endpoints, receber as requisições HTTP, delegar o processamento aos *Services* e devolver as respostas em formato JSON.

## 4. Regras de Negócio Aplicadas
* **Aeronaves:** Não é possível cadastrar uma aeronave com capacidade de assentos zerada ou negativa. O tipo da aeronave é um campo obrigatório.
* **Voos:** Ao alocar um voo, a API deve validar se a aeronave designada existe e possui capacidade disponível.

## 5. Lista de Endpoints

Abaixo estão listados os endpoints da API.

### 5.1. Aeronaves (`/api/aeronaves`)

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| **GET** | `/api/aeronaves` | Lista todas as aeronaves cadastradas. |
| **GET** | `/api/aeronaves/{id}` | Retorna os detalhes de uma aeronave específica pelo seu ID. |
| **POST** | `/api/aeronaves` | Cadastra uma nova aeronave. Requer JSON no *body*. |
| **PUT** | `/api/aeronaves/{id}` | Atualiza os dados de uma aeronave existente. |
| **DELETE** | `/api/aeronaves/{id}` | Remove uma aeronave do sistema. |

**Exemplo de JSON (POST/PUT - Aeronave):**
```json
{
  "tipo": "Boeing 737",
  "qtdAssentos": 150
}