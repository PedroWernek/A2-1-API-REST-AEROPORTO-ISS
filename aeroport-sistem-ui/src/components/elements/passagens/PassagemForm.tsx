import { passageiroService, type Passageiro } from "@/services/passageiroService";
import { passagemService } from "@/services/passagemService";
import { vooService, type Voo } from "@/services/vooService";
import { useEffect, useState, type FormEvent } from "react";

interface PassagemFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function PassagemForm({ onSuccess, onCancel }: PassagemFormProps) {
  const [passageiros, setPassageiros] = useState<Passageiro[]>([]);
  const [voos, setVoos] = useState<Voo[]>([]);
  const [formData, setFormData] = useState({
    passageiroId: "",
    vooId: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    passageiroService.listar().then(setPassageiros).catch(console.error);
    vooService.listar().then(setVoos).catch(console.error);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await passagemService.criar(formData);
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
        <label className="mb-1 block text-sm font-medium text-slate-700">Passageiro</label>
        <select
          required
          value={formData.passageiroId}
          onChange={(e) => setFormData({ ...formData, passageiroId: e.target.value })}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
        >
          <option value="" disabled>Selecione um passageiro...</option>
          {passageiros.map((passageiro) => (
            <option key={passageiro.id} value={passageiro.id}>
              {passageiro.nome} ({passageiro.cpf})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Voo</label>
        <select
          required
          value={formData.vooId}
          onChange={(e) => setFormData({ ...formData, vooId: e.target.value })}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
        >
          <option value="" disabled>Selecione um voo...</option>
          {voos.map((voo) => (
            <option 
              key={voo.id} 
              value={voo.id} 
              disabled={voo.assentosDisponiveis === 0}
            >
              {voo.origem} → {voo.destino} | {voo.dataHoraVoo} ({voo.assentosDisponiveis} vagas)
            </option>
          ))}
        </select>
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
          {loading ? "A Emitir..." : "Emitir Passagem"}
        </button>
      </div>
    </form>
  );
}