import { useState, useEffect } from "react"
import { passagemService, Passagem } from "../../../services/passagemService"
import {
  passageiroService,
  Passageiro,
} from "../../../services/passageiroService"
import { vooService, Voo } from "../../../services/vooService"

interface PassagemFormProps {
  passagemEditando?: Passagem | null
  onSuccess: () => void
  onCancel: () => void
}

export function PassagemForm({
  passagemEditando,
  onSuccess,
  onCancel,
}: PassagemFormProps) {
  const [passageiros, setPassageiros] = useState<Passageiro[]>([])
  const [voos, setVoos] = useState<Voo[]>([])

  // 1. Estado atualizado para conter Assento e Valor
  const [formData, setFormData] = useState({
    passageiroId: "",
    vooId: "",
    assento: "",
    valor: "",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    passageiroService.listar().then(setPassageiros).catch(console.error)
    vooService.listar().then(setVoos).catch(console.error)

    // 2. Mapeamento seguro para edição lendo os IDs de dentro dos objetos
    if (passagemEditando) {
      setFormData({
        passageiroId:
          (passagemEditando.passageiro as Passageiro)?.id ||
          (passagemEditando.passageiro as { id: string })?.id ||
          "",
        vooId:
          (passagemEditando.voo as Voo)?.id ||
          (passagemEditando.voo as { id: string })?.id ||
          "",
        assento: passagemEditando.assento || "",
        valor: passagemEditando.valor?.toString() || "",
      })
    }
  }, [passagemEditando])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    // 3. A MAGICA: Transformar o state no JSON perfeito para o Java
    const payload: Passagem = {
      assento: formData.assento,
      valor: parseFloat(formData.valor),
      voo: { id: formData.vooId }, // Objeto aninhado para o Hibernate
      passageiro: { id: formData.passageiroId }, // Objeto aninhado para o Hibernate
    }

    try {
      if (passagemEditando?.id) {
        await passagemService.atualizar(passagemEditando.id, payload)
      } else {
        await passagemService.criar(payload)
      }
      onSuccess()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Passageiro
          </label>
          <select
            required
            value={formData.passageiroId}
            onChange={(e) =>
              setFormData({ ...formData, passageiroId: e.target.value })
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-1 focus:ring-slate-900 focus:outline-none"
          >
            <option value="">Selecione...</option>
            {passageiros.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Voo
          </label>
          <select
            required
            value={formData.vooId}
            onChange={(e) =>
              setFormData({ ...formData, vooId: e.target.value })
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-1 focus:ring-slate-900 focus:outline-none"
          >
            <option value="">Selecione...</option>
            {voos.map((v) => (
              <option
                key={v.id}
                value={v.id}
                disabled={v.assentosDisponiveis === 0 && !passagemEditando}
              >
                {v.origem} → {v.destino}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Assento
          </label>
          <input
            required
            type="text"
            placeholder="Ex: 12A"
            value={formData.assento}
            onChange={(e) =>
              setFormData({
                ...formData,
                assento: e.target.value.toUpperCase(),
              })
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-1 focus:ring-slate-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Valor (R$)
          </label>
          <input
            required
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.valor}
            onChange={(e) =>
              setFormData({ ...formData, valor: e.target.value })
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-1 focus:ring-slate-900 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-4 py-2 text-sm hover:bg-slate-100"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {loading
            ? "A Processar..."
            : passagemEditando
              ? "Atualizar Passagem"
              : "Emitir Passagem"}
        </button>
      </div>
    </form>
  )
}
