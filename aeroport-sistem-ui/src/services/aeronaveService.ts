import { api } from "../lib/api"

export interface Aeronave {
  id?: string
  tipo: string
  capacidadeAssentos: number
  modelo: string
}

export const aeronaveService = {
  listar: async (): Promise<Aeronave[]> => {
    const response = await api.get("/aeronaves")
    return response.data
  },

  criar: async (aeronave: Aeronave): Promise<Aeronave> => {
    const response = await api.post("/aeronaves", aeronave)
    return response.data
  },

  atualizar: async (id: string, aeronave: Aeronave): Promise<Aeronave> => {
    const response = await api.put(`/aeronaves/${id}`, aeronave)
    return response.data
  },

  remover: async (id: string): Promise<void> => {
    await api.delete(`/aeronaves/${id}`)
  },
}
