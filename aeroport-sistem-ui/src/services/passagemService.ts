import { api } from "../lib/api";

export interface Passagem {
  id: string;
  passageiroId: string;
  vooId: string;
}

export const passagemService = {
  listar: () => api.get("/passagem"),
  obter: (id: string) => api.get(`/passagem/${id}`),
  criar: (data: Omit<Passagem, "id">) => api.post("/passagem", data),
  atualizar: (id: string, data: Partial<Passagem>) => api.put(`/passagem/${id}`, data),
  remover: (id: string) => api.delete(`/passagem/${id}`),
};