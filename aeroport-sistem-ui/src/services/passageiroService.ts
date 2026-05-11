import { api } from "@/lib/api";

export interface Passageiro {
  id: string;
  nome: string;
  cpf: string;
}

export const passageiroService = {
  listar: () => api.get("/passageiro"),
  obter: (id: string) => api.get(`/passageiro/${id}`),
  criar: (data: Omit<Passageiro, "id">) => api.post("/passageiro", data),
  atualizar: (id: string, data: Partial<Passageiro>) => api.put(`/passageiro/${id}`, data),
  remover: (id: string) => api.delete(`/passageiro/${id}`),
};