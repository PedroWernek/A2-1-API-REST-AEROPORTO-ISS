package br.edu.up.model;

public class Aeronave {
    private String id;
    private String tipo;
    private int capacidadeAssentos;
    private String modelo;

    public Aeronave() {

    }

    public Aeronave(String id, String tipo, int capacidadeAssentos, String modelo) {
        this.id = id;
        this.tipo = tipo;
        this.capacidadeAssentos = capacidadeAssentos;
        this.modelo = modelo;
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

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public int getCapacidadeAssentos() {
        return capacidadeAssentos;
    }

    public void setCapacidadeAssentos(int capacidadeAssentos) {
        this.capacidadeAssentos = capacidadeAssentos;
    }

}