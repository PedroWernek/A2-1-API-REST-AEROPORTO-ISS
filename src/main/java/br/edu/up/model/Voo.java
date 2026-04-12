package br.edu.up.model;


public class Voo {
    private int id;
    private String origem;
    private String destino;
    private String dataHoraVoo;
    private int assentosDisponiveis;

    private Aeronave aeronave;

    public Voo() {
    }

    public Voo(int id, String origem, String destino, String dataHoraVoo, Aeronave aeronave) throws IllegalArgumentException{
        if(aeronave.getCapacidadeAssentos() <= 0){
            throw new IllegalArgumentException("Nave cadastrada com número inválido de assentos (" + aeronave.getCapacidadeAssentos() + ")");
        }else {
            this.id = id;
            this.origem = origem;
            this.destino = destino;
            this.dataHoraVoo = dataHoraVoo;
            this.assentosDisponiveis = aeronave.getCapacidadeAssentos();
            this.aeronave = aeronave;
        }
    }

    public int getId() {
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

    public Aeronave getAeronave() {
        return aeronave;
    }

    public void setAeronave(Aeronave aeronave) throws IllegalArgumentException {
        int quantidadeDeAssentos = aeronave.getCapacidadeAssentos();
        if(quantidadeDeAssentos <= 0){
            throw new IllegalArgumentException("Nave cadastrada com número inválido de assentos (" + quantidadeDeAssentos + ")");
        }else {
            this.aeronave = aeronave;
        }
    }
}