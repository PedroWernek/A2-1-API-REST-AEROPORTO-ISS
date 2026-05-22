import { useState, useEffect, FormEvent } from "react";
import { passagemService } from "../../../services/passagemService";
import { passageiroService, Passageiro } from "../../../services/passageiroService";
import { vooService, Voo } from "../../../services/vooService";

interface PassagemFormProps {
  passagemEditando?: Passagem | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PassagemForm({ passagemEditando, onSuccess, onCancel }: PassagemFormProps) {
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
    if (passagemEditando) {
      setFormData({
        passageiroId: passagemEditando.passageiroId,
        vooId: passagemEditando.vooId,
      });
    }
  }, [passagemEditando]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (passagemEditando?.id) {
        await passagemService.atualizar(passagemEditando.id, formData);
      } else {
        await passagemService.criar(formData);
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
        <label className="mb-1 block text-sm font-medium text-slate-700">Passageiro</label>
        <select required value={formData.passageiroId} onChange={(e) => setFormData({ ...formData, passageiroId: e.target.value })} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900">
          <option value="">Selecione...</option>
          {passageiros.map((p) => (<option key={p.id} value={p.id}>{p.nome}</option>))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Voo</label>
        <select required value={formData.vooId} onChange={(e) => setFormData({ ...formData, vooId: e.target.value })} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900">
          <option value="">Selecione...</option>
          {voos.map((v) => (<option key={v.id} value={v.id} disabled={v.assentosDisponiveis === 0 && !passagemEditando}>{v.origem} → {v.destino}</option>))}
        </select>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <button type="button" onClick={onCancel} className="text-sm px-4 py-2 hover:bg-slate-100 rounded-md">Cancelar</button>
        <button type="submit" disabled={loading} className="bg-slate-900 text-white px-4 py-2 text-sm rounded-md hover:bg-slate-800 disabled:opacity-50">
          {loading ? "A Processar..." : passagemEditando ? "Trocar Assento" : "Emitir"}
        </button>
      </div>
    </form>
  );
}