import { useEffect, useState } from "react";
import { Plus, MoreHorizontal, Loader2 } from "lucide-react";
import { passageiroService, Passageiro } from "../../services/passageiroService";
import { Modal } from "../ui/Modal";
import { PassageiroForm } from "./PassageiroForm";

export function PassageirosList() {
  const [passageiros, setPassageiros] = useState<Passageiro[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleSuccess = () => {
    setIsModalOpen(false);
    carregarPassageiros();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-slate-900">Todos os Passageiros</h3>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          <Plus size={16} />
          Novo Passageiro
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
                <th className="px-6 py-4 font-medium">Nome</th>
                <th className="px-6 py-4 font-medium">CPF</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {passageiros.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                    Nenhum passageiro encontrado.
                  </td>
                </tr>
              ) : (
                passageiros.map((passageiro) => (
                  <tr key={passageiro.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-6 py-4">{passageiro.nome}</td>
                    <td className="px-6 py-4">{passageiro.cpf}</td>
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
        title="Novo Passageiro"
      >
        <PassageiroForm 
          onSuccess={handleSuccess} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
}