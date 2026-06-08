import { api } from "../lib/api"

export interface Endereco {
  id?: string
  cep: string
  logradouro: string
  bairro: string
  localidade: string
  uf: string
}

export interface Passageiro {
  id?: string
  nome: string
  cpf: string
  endereco: Endereco
}

export const passageiroService = {
  listar: async (): Promise<Passageiro[]> => {
    return await api.get("/passageiro")
  },
  criar: async (passageiro: Passageiro): Promise<Passageiro> => {
    return await api.post("/passageiro", passageiro)
  },
  atualizar: async (
    id: string,
    passageiro: Passageiro
  ): Promise<Passageiro> => {
    return await api.put(`/passageiro/${id}`, passageiro)
  },
  remover: async (id: string): Promise<void> => {
    await api.delete(`/passageiro/${id}`)
  },
}
