import { api } from "../lib/api"
import { Voo } from "./vooService"
import { Passageiro } from "./passageiroService"

export interface Passagem {
  id?: string
  assento: string
  valor: number
  voo: Voo | { id: string }
  passageiro: Passageiro | { id: string }
}

export const passagemService = {
  listar: async (): Promise<Passagem[]> => {
    const response = await api.get("/passagens")
    return response.data
  },

  criar: async (passagem: Passagem): Promise<Passagem> => {
    const response = await api.post("/passagens", passagem)
    return response.data
  },

  atualizar: async (id: string, passagem: Passagem): Promise<Passagem> => {
    const response = await api.put(`/passagens/${id}`, passagem)
    return response.data
  },

  remover: async (id: string): Promise<void> => {
    await api.delete(`/passagens/${id}`)
  },
}
