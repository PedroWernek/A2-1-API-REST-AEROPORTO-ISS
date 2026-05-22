import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { passageiroService, Passageiro } from "../../../services/passageiroService";
import { Modal } from "../../ui/Modal";
import { PassageiroForm } from "./PassageiroForm";

export function PassageirosList() {
  const [passageiros, setPassageiros] = useState<Passageiro[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passageiroEditando, setPassageiroEditando] = useState<Passageiro | null>(null);

  useEffect(() => {
    carregarPassageiros();
  }, []);

  const carregarPassageiros = async () => {
    setLoading(true);
    try {
      const data = await passageiroService.listar();
      setPassageiros(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Deseja eliminar este passageiro?")) {
      try {
        await passageiroService.remover(id);
        carregarPassageiros();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleEdit = (p: Passageiro) => {
    setPassageiroEditando(p);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setPassageiroEditando(null);
    carregarPassageiros();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-slate-900">Passageiros</h3>
        <button onClick={() => { setPassageiroEditando(null); setIsModalOpen(true); }} className="flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
          <Plus size={16} /> Novo Passageiro
        </button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-slate-400" /></div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-900 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Nome</th>
                <th className="px-6 py-4 font-medium">CPF</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-600">
              {passageiros.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">{p.nome}</td>
                  <td className="px-6 py-4">{p.cpf}</td>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={passageiroEditando ? "Editar Passageiro" : "Novo Passageiro"}>
        <PassageiroForm passageiroEditando={passageiroEditando} onSuccess={handleSuccess} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}