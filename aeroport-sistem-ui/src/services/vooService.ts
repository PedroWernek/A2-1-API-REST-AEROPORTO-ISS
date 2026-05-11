import { api } from "@/lib/api";

export interface Voo {
  id: string;
  origem: string;
  destino: string;
  dataHoraVoo: string;
  assentosDisponiveis: number;
  aeronaveId: string;
}

export const vooService = {
  listar: () => api.get("/voo"),
  obter: (id: string) => api.get(`/voo/${id}`),
  criar: (data: Omit<Voo, "id">) => api.post("/voo", data),
  atualizar: (id: string, data: Partial<Voo>) => api.put(`/voo/${id}`, data),
  remover: (id: string) => api.delete(`/voo/${id}`),
};