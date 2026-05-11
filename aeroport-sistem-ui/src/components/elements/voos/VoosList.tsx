import { useEffect, useState } from "react";
import { Plus, MoreHorizontal, Loader2 } from "lucide-react";
import { vooService, Voo } from "../../services/vooService";
import { Modal } from "../ui/Modal";
import { VooForm } from "./VooForm";

export function VoosList() {
  const [voos, setVoos] = useState<Voo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleSuccess = () => {
    setIsModalOpen(false);
    carregarVoos();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-slate-900">Todos os Voos</h3>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          <Plus size={16} />
          Novo Voo
        </button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-900">
              <tr>
                <th className="px-6 py-4 font-medium">Origem</th>
                <th className="px-6 py-4 font-medium">Destino</th>
                <th className="px-6 py-4 font-medium">Data/Hora</th>
                <th className="px-6 py-4 font-medium">Assentos</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {voos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Nenhum voo encontrado.
                  </td>
                </tr>
              ) : (
                voos.map((voo) => (
                  <tr key={voo.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-6 py-4">{voo.origem}</td>
                    <td className="px-6 py-4">{voo.destino}</td>
                    <td className="px-6 py-4">{voo.dataHoraVoo}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          voo.assentosDisponiveis > 0
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {voo.assentosDisponiveis} disponíveis
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-900">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Agendar Novo Voo"
      >
        <VooForm 
          onSuccess={handleSuccess} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
}