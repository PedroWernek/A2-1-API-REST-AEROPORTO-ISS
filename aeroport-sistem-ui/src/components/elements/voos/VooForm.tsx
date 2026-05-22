import { useState, useEffect, FormEvent } from "react";
import { vooService } from "../../../services/vooService";
import { aeronaveService, Aeronave } from "../../../services/aeronaveService";

interface VooFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function VooForm({ onSuccess, onCancel }: VooFormProps) {
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([]);
  const [formData, setFormData] = useState({
    origem: "",
    destino: "",
    dataHoraVoo: "",
    assentosDisponiveis: 0,
    aeronaveId: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    aeronaveService.listar()
      .then(setAeronaves)
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await vooService.criar(formData);
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
        <label className="mb-1 block text-sm font-medium text-slate-700">Aeronave</label>
        <select
          required
          value={formData.aeronaveId}
          onChange={(e) => setFormData({ ...formData, aeronaveId: e.target.value })}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
        >
          <option value="" disabled>Selecione uma aeronave...</option>
          {aeronaves.map((aeronave) => (
            <option key={aeronave.id} value={aeronave.id}>
              {aeronave.modelo} ({aeronave.capacidadeAssentos} assentos)
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Origem</label>
          <input
            required
            type="text"
            value={formData.origem}
            onChange={(e) => setFormData({ ...formData, origem: e.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Destino</label>
          <input
            required
            type="text"
            value={formData.destino}
            onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Data e Hora</label>
          <input
            required
            type="text"
            placeholder="Ex: 2026-12-01 14:30"
            value={formData.dataHoraVoo}
            onChange={(e) => setFormData({ ...formData, dataHoraVoo: e.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Assentos Iniciais</label>
          <input
            required
            type="number"
            min="1"
            value={formData.assentosDisponiveis || ""}
            onChange={(e) => setFormData({ ...formData, assentosDisponiveis: Number(e.target.value) })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>
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