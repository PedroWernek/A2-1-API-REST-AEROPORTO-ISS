package br.edu.up.model;

public class Passagem {
    private String id;
    private String assento;
    private double valor; //preço da passagem

    private Voo voo;
    private Passageiro passageiro;

    public Passagem() {}

    public Passagem(String id, String assento, double valor, Voo voo, Passageiro passageiro) {
        this.id = id;
        this.assento = assento;
        this.valor = valor;
        this.voo = voo;
        this.passageiro = passageiro;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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