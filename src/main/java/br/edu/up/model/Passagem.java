package br.edu.up.model;

public class Passagem {
    private int id;
    private String assento;
    private double valor; //preço da passagem

    private Voo voo;
    private Passageiro passageiro;

    /*
    * TEMOS QUE VER A FORMA EM QUE A QUANTIDADE DE ASSENTOS IRÁ QUANDO UMA NOVA PASSAGEM FOR CRIADA
    * */
    public Passagem() {}

    public Passagem(int id, String assento, double valor, Voo voo, Passageiro passageiro) {
        this.id = id;
        this.assento = assento;
        this.valor = valor;
        this.voo = voo;
        this.passageiro = passageiro;
    }

    // Getters e Setters
    public int getId() {
        return id;
    }

    public String getAssento() {
        return assento;
    }

    public void setAssento(String assento) {
        this.assento = assento;
    }

    public double getValor() {
        return valor;
    }

    public void setValor(double valor) {
        this.valor = valor;
    }

    public Voo getVoo() {
        return voo;
    }

    public void setVoo(Voo voo) {
        this.voo = voo;
    }

    public Passageiro getPassageiro() {
        return passageiro;
    }

    public void setPassageiro(Passageiro passageiro) {
        this.passageiro = passageiro;
    }
}