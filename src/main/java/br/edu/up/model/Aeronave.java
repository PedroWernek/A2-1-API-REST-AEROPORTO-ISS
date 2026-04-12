package br.edu.up.model;

public class Aeronave {
    private int id;
    private String tipo;
    private int capacidadeAssentos;

    public Aeronave() {

    }

    public Aeronave(int id, String tipo, int capacidadeAssentos) {
        this.id = id;
        this.tipo = tipo;
        this.capacidadeAssentos = capacidadeAssentos;
    }

    public int getId() {
        return id;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public int getCapacidadeAssentos() {
        return capacidadeAssentos;
    }

    public void setCapacidadeAssentos(int capacidadeAssentos) {
        this.capacidadeAssentos = capacidadeAssentos;
    }
}