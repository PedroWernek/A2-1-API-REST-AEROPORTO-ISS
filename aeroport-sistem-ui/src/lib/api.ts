// Removemos o http://localhost:8000 daqui, o Vite tratará disso via Proxy
const BASE_URL = "";

export const api = {
  get: async (endpoint: string) => {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error("Erro na requisição HTTP");
    return response.json();
  },
  
  post: async (endpoint: string, data: unknown) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro na requisição HTTP");
    return response.json();
  },
  
  put: async (endpoint: string, data: unknown) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro na requisição HTTP");
    return response.json();
  },
  
  delete: async (endpoint: string) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro na requisição HTTP");
    return response.json();
  },
};