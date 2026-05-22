import { useState, useEffect, FormEvent } from "react";
import { vooService, Voo } from "../../../services/vooService";
import { aeronaveService, Aeronave } from "../../../services/aeronaveService";

interface VooFormProps {
  vooEditando?: Voo | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function VooForm({ vooEditando, onSuccess, onCancel }: VooFormProps) {
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
    aeronaveService.listar().then(setAeronaves).catch(console.error);
    if (vooEditando) {
      setFormData({
        origem: vooEditando.origem,
        destino: vooEditando.destino,
        dataHoraVoo: vooEditando.dataHoraVoo,
        assentosDisponiveis: vooEditando.assentosDisponiveis,
        aeronaveId: vooEditando.aeronaveId,
      });
    }
  }, [vooEditando]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (vooEditando?.id) {
        await vooService.atualizar(vooEditando.id, formData);
      } else {
        await vooService.criar(formData);
      }
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
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
        >
          <option value="">Selecione...</option>
          {aeronaves.map((a) => (
            <option key={a.id} value={a.id}>{a.modelo}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input required placeholder="Origem" value={formData.origem} onChange={(e) => setFormData({ ...formData, origem: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <input required placeholder="Destino" value={formData.destino} onChange={(e) => setFormData({ ...formData, destino: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input required placeholder="Data/Hora" value={formData.dataHoraVoo} onChange={(e) => setFormData({ ...formData, dataHoraVoo: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <input required type="number" placeholder="Assentos" value={formData.assentosDisponiveis || ""} onChange={(e) => setFormData({ ...formData, assentosDisponiveis: Number(e.target.value) })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <button type="button" onClick={onCancel} className="text-sm font-medium text-slate-700 px-4 py-2 hover:bg-slate-100 rounded-md">Cancelar</button>
        <button type="submit" disabled={loading} className="bg-slate-900 text-white px-4 py-2 text-sm rounded-md hover:bg-slate-800 disabled:opacity-50">
          {loading ? "A Guardar..." : vooEditando ? "Atualizar" : "Guardar"}
        </button>
      </div>
    </form>
  );
}