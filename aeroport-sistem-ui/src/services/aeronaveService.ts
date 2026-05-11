import { api } from "@/lib/api";

export interface Aeronave {
  id: string;
  tipo: string;
  capacidadeAssentos: number;
  modelo: string;
}

export const aeronaveService = {
  listar: () => api.get("/aeronave"),
  obter: (id: string) => api.get(`/aeronave/${id}`),
  criar: (data: Omit<Aeronave, "id">) => api.post("/aeronave", data),
  atualizar: (id: string, data: Partial<Aeronave>) => api.put(`/aeronave/${id}`, data),
  remover: (id: string) => api.delete(`/aeronave/${id}`),
};