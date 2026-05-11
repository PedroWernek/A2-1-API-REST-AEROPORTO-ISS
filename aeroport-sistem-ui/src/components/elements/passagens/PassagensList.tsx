import { useEffect, useState } from "react";
import { Plus, MoreHorizontal, Loader2 } from "lucide-react";
import { passagemService, Passagem } from "../../services/passagemService";
import { Modal } from "../ui/Modal";
import { PassagemForm } from "./PassagemForm";

export function PassagensList() {
  const [passagens, setPassagens] = useState<Passagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleSuccess = () => {
    setIsModalOpen(false);
    carregarPassagens();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-slate-900">Passagens Emitidas</h3>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          <Plus size={16} />
          Emitir Passagem
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
                <th className="px-6 py-4 font-medium">Cód. Passagem</th>
                <th className="px-6 py-4 font-medium">ID Passageiro</th>
                <th className="px-6 py-4 font-medium">ID Voo</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {passagens.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    Nenhuma passagem emitida até ao momento.
                  </td>
                </tr>
              ) : (
                passagens.map((passagem) => (
                  <tr key={passagem.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{passagem.id}</td>
                    <td className="px-6 py-4">{passagem.passageiroId}</td>
                    <td className="px-6 py-4">{passagem.vooId}</td>
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
        title="Nova Emissão de Passagem"
      >
        <PassagemForm 
          onSuccess={handleSuccess} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
}