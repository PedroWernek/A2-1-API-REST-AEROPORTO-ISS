import { useEffect, useState } from "react";
import { Plus, Loader2, Pencil, Trash2 } from "lucide-react";
import { passagemService, Passagem } from "../../../services/passagemService";
import { Modal } from "../../ui/Modal";
import { PassagemForm } from "./PassagemForm";
import { passagemService, type Passagem } from "@/services/passagemService";
import { Modal } from "@/components/ui/Modal";

export function PassagensList() {
  const [passagens, setPassagens] = useState<Passagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passagemEditando, setPassagemEditando] = useState<Passagem | null>(null);

  useEffect(() => {
    carregarPassagens();
  }, []);

  const carregarPassagens = async () => {
    setLoading(true);
    try {
      const data = await passagemService.listar();
      setPassagens(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Deseja cancelar esta passagem?")) {
      try {
        await passagemService.remover(id);
        carregarPassagens();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleEdit = (p: Passagem) => {
    setPassagemEditando(p);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setPassagemEditando(null);
    carregarPassagens();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-slate-900">Passagens Emitidas</h3>
        <button onClick={() => { setPassagemEditando(null); setIsModalOpen(true); }} className="flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
          <Plus size={16} /> Emitir Passagem
        </button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-slate-400" /></div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-900 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Cód. Passagem</th>
                <th className="px-6 py-4 font-medium">ID Passageiro</th>
                <th className="px-6 py-4 font-medium">ID Voo</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-600">
              {passagens.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-xs">{p.id}</td>
                  <td className="px-6 py-4">{p.passageiroId}</td>
                  <td className="px-6 py-4">{p.vooId}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(p)} className="p-1 text-slate-400 hover:text-blue-600"><Pencil size={18} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1 text-slate-400 hover:text-red-600"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={passagemEditando ? "Trocar Assento / Editar Passagem" : "Nova Emissão"}>
        <PassagemForm passagemEditando={passagemEditando} onSuccess={handleSuccess} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}