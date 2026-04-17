package br.edu.up.model;


public class Voo {
    private String id;
    private String origem;
    private String destino;
    private String dataHoraVoo;
    private int assentosDisponiveis;

    private Aeronave aeronave;

    public Voo() {
    }

    public Voo(String id, String origem, String destino, String dataHoraVoo, int assentosDisponiveis, Aeronave aeronave) {
        this.id = id;
        this.origem = origem;
        this.destino = destino;
        this.dataHoraVoo = dataHoraVoo;
        this.assentosDisponiveis = assentosDisponiveis;
        this.aeronave = aeronave;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public String getOrigem() {
        return origem;
    }

    public void setOrigem(String origem) {
        this.origem = origem;
    }

    public String getDestino() {
        return destino;
    }

    public void setDestino(String destino) {
        this.destino = destino;
    }

    public String getDataHoraVoo() {
        return dataHoraVoo;
    }

    public void setDataHoraVoo(String dataHoraVoo) {
        this.dataHoraVoo = dataHoraVoo;
    }

    public int getAssentosDisponiveis() {
        return assentosDisponiveis;
    }

    public void setAssentosDisponiveis(int assentosDisponiveis) {
        this.assentosDisponiveis = assentosDisponiveis;
    }

    public Aeronave getAeronave() {
        return aeronave;
    }

    public void setAeronave(Aeronave aeronave) {
        this.aeronave = aeronave;
    }
}