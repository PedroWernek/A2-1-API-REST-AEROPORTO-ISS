import { useState, FormEvent, useEffect } from "react";
import { passageiroService, Passageiro } from "../../../services/passageiroService";

interface PassageiroFormProps {
  passageiroEditando?: Passageiro | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PassageiroForm({ passageiroEditando, onSuccess, onCancel }: PassageiroFormProps) {
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (passageiroEditando) {
      setFormData({
        nome: passageiroEditando.nome,
        cpf: passageiroEditando.cpf,
      });
    }
  }, [passageiroEditando]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (passageiroEditando?.id) {
        await passageiroService.atualizar(passageiroEditando.id, formData);
      } else {
        await passageiroService.criar(formData);
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
        <label className="mb-1 block text-sm font-medium text-slate-700">Nome Completo</label>
        <input
          required
          type="text"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">CPF</label>
        <input
          required
          type="text"
          value={formData.cpf}
          onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
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
          {loading ? "A Guardar..." : passageiroEditando ? "Atualizar" : "Guardar"}
        </button>
      </div>
    </form>
  );
}