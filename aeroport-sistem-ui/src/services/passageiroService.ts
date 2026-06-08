import { api } from "../lib/api"

// 1. As interfaces exatas que batem com o seu Java
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

// 2. As chamadas da API
export const passageiroService = {
  listar: async (): Promise<Passageiro[]> => {
    const response = await api.get("/passageiros")
    return response.data
  },

  criar: async (passageiro: Passageiro): Promise<Passageiro> => {
    const response = await api.post("/passageiros", passageiro)
    return response.data
  },

  atualizar: async (
    id: string,
    passageiro: Passageiro
  ): Promise<Passageiro> => {
    const response = await api.put(`/passageiros/${id}`, passageiro)
    return response.data
  },

  remover: async (id: string): Promise<void> => {
    await api.delete(`/passageiros/${id}`)
  },
}
