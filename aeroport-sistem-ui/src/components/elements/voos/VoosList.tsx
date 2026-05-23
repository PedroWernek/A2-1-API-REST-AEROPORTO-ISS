import { useEffect, useState } from "react";
import { Plus, Loader2, Pencil, Trash2 } from "lucide-react";
import { vooService, Voo } from "../../../services/vooService";
import { Modal } from "../../ui/Modal";
import { VooForm } from "./VooForm";
import { vooService, type Voo } from "@/services/vooService";
import { Modal } from "@/components/ui/Modal";

export function VoosList() {
  const [voos, setVoos] = useState<Voo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vooEditando, setVooEditando] = useState<Voo | null>(null);

  useEffect(() => {
    carregarVoos();
  }, []);

  const carregarVoos = async () => {
    setLoading(true);
    try {
      const data = await vooService.listar();
      setVoos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Deseja eliminar este voo?")) {
      try {
        await vooService.remover(id);
        carregarVoos();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleEdit = (v: Voo) => {
    setVooEditando(v);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setVooEditando(null);
    carregarVoos();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-slate-900">Voos</h3>
        <button onClick={() => { setVooEditando(null); setIsModalOpen(true); }} className="flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
          <Plus size={16} /> Novo Voo
        </button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-slate-400" /></div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-900 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Origem</th>
                <th className="px-6 py-4 font-medium">Destino</th>
                <th className="px-6 py-4 font-medium">Data/Hora</th>
                <th className="px-6 py-4 font-medium">Assentos</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-600">
              {voos.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">{v.origem}</td>
                  <td className="px-6 py-4">{v.destino}</td>
                  <td className="px-6 py-4">{v.dataHoraVoo}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${v.assentosDisponiveis > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                      {v.assentosDisponiveis} disponíveis
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(v)} className="p-1 text-slate-400 hover:text-blue-600"><Pencil size={18} /></button>
                      <button onClick={() => handleDelete(v.id)} className="p-1 text-slate-400 hover:text-red-600"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={vooEditando ? "Editar Voo" : "Novo Voo"}>
        <VooForm vooEditando={vooEditando} onSuccess={handleSuccess} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}