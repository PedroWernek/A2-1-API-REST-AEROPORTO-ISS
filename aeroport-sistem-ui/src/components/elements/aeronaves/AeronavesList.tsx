import { useEffect, useState } from "react";
import { Plus, MoreHorizontal, Loader2 } from "lucide-react";
import { aeronaveService, Aeronave } from "../../services/aeronaveService";
import { Modal } from "../ui/Modal";
import { AeronaveForm } from "./AeronaveForm";

export function AeronavesList() {
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    carregarAeronaves();
  }, []);

  const carregarAeronaves = async () => {
    setLoading(true);
    try {
      const data = await aeronaveService.listar();
      setAeronaves(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    carregarAeronaves();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-slate-900">Todas as Aeronaves</h3>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          <Plus size={16} />
          Nova Aeronave
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
                <th className="px-6 py-4 font-medium">Modelo</th>
                <th className="px-6 py-4 font-medium">Tipo</th>
                <th className="px-6 py-4 font-medium">Capacidade</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {aeronaves.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    Nenhuma aeronave encontrada.
                  </td>
                </tr>
              ) : (
                aeronaves.map((aeronave) => (
                  <tr key={aeronave.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-6 py-4">{aeronave.modelo}</td>
                    <td className="px-6 py-4">{aeronave.tipo}</td>
                    <td className="px-6 py-4">{aeronave.capacidadeAssentos} assentos</td>
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
        title="Nova Aeronave"
      >
        <AeronaveForm 
          onSuccess={handleSuccess} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
}