package br.edu.up.model;

public class Passageiro {
    private int id;
    private String nome;
    private String cpf;

    public Passageiro() {}

    public Passageiro(int id, String nome, String cpf) {
        this.id = id;
        this.nome = nome;
        this.cpf = cpf;
    }

    public int getId() { return id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }
}