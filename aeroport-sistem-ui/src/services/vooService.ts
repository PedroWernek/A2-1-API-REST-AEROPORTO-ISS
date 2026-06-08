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
    return await api.get("/voo")
  },
  criar: async (voo: Voo): Promise<Voo> => {
    return await api.post("/voo", voo)
  },
  atualizar: async (id: string, voo: Voo): Promise<Voo> => {
    return await api.put(`/voo/${id}`, voo)
  },
  remover: async (id: string): Promise<void> => {
    await api.delete(`/voo/${id}`)
  },
}
