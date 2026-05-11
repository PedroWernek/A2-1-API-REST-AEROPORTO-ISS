import { useState, FormEvent } from "react";
import { aeronaveService } from "../../services/aeronaveService";

interface AeronaveFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AeronaveForm({ onSuccess, onCancel }: AeronaveFormProps) {
  const [formData, setFormData] = useState({
    modelo: "",
    tipo: "",
    capacidadeAssentos: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await aeronaveService.criar(formData);
      onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Modelo</label>
        <input
          required
          type="text"
          value={formData.modelo}
          onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Tipo</label>
        <input
          required
          type="text"
          value={formData.tipo}
          onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Capacidade de Assentos</label>
        <input
          required
          type="number"
          min="1"
          max="1000"
          value={formData.capacidadeAssentos || ""}
          onChange={(e) => setFormData({ ...formData, capacidadeAssentos: Number(e.target.value) })}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
        />
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {loading ? "A Guardar..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}