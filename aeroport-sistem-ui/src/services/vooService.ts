import { api } from "../lib/api"
import { Aeronave } from "./aeronaveService"

export interface Voo {
  id?: string
  origem: string
  destino: string
  dataHoraVoo: string
  assentosDisponiveis: number
  aeronave: Aeronave | { id: string }
}

export const vooService = {
  listar: async (): Promise<Voo[]> => {
    const response = await api.get("/voos")
    return response.data
  },

  criar: async (voo: Voo): Promise<Voo> => {
    const response = await api.post("/voos", voo)
    return response.data
  },

  atualizar: async (id: string, voo: Voo): Promise<Voo> => {
    const response = await api.put(`/voos/${id}`, voo)
    return response.data
  },

  remover: async (id: string): Promise<void> => {
    await api.delete(`/voos/${id}`)
  },
}
