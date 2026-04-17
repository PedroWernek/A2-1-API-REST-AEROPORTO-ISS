package br.edu.up.model;

public class Aeronave {
    private String id;
    private String tipo;
    private int capacidadeAssentos;

    public Aeronave() {

    }

    public Aeronave(String id, String tipo, int capacidadeAssentos) {
        this.id = id;
        this.tipo = tipo;
        this.capacidadeAssentos = capacidadeAssentos;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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