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
    return await api.get("/passagem")
  },
  criar: async (passagem: Passagem): Promise<Passagem> => {
    return await api.post("/passagem", passagem)
  },
  atualizar: async (id: string, passagem: Passagem): Promise<Passagem> => {
    return await api.put(`/passagem/${id}`, passagem)
  },
  remover: async (id: string): Promise<void> => {
    await api.delete(`/passagem/${id}`)
  },
}
