import { api } from "../lib/api"

export interface Aeronave {
  id?: string
  tipo: string
  capacidadeAssentos: number
  modelo: string
}

export const aeronaveService = {
  listar: async (): Promise<Aeronave[]> => {
    return await api.get("/aeronave") // Rota no singular e sem .data
  },
  criar: async (aeronave: Aeronave): Promise<Aeronave> => {
    return await api.post("/aeronave", aeronave)
  },
  atualizar: async (id: string, aeronave: Aeronave): Promise<Aeronave> => {
    return await api.put(`/aeronave/${id}`, aeronave)
  },
  remover: async (id: string): Promise<void> => {
    await api.delete(`/aeronave/${id}`)
  },
}
