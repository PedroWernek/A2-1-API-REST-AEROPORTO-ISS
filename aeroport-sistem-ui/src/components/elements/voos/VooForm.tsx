import { useState, useEffect } from "react"
import { vooService, Voo } from "../../../services/vooService"
import { aeronaveService, Aeronave } from "../../../services/aeronaveService"

interface VooFormProps {
  vooEditando?: Voo | null
  onSuccess: () => void
  onCancel: () => void
}

export function VooForm({ vooEditando, onSuccess, onCancel }: VooFormProps) {
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([])

  // 1. Estado mapeando todos os campos exigidos pela classe Java
  const [formData, setFormData] = useState({
    origem: "",
    destino: "",
    dataHoraVoo: "",
    assentosDisponiveis: "",
    aeronaveId: "",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Carrega a lista de aeronaves para o Select
    aeronaveService.listar().then(setAeronaves).catch(console.error)

    // 2. Preenche os dados de forma segura, extraindo o ID do objeto aninhado
    if (vooEditando) {
      setFormData({
        origem: vooEditando.origem || "",
        destino: vooEditando.destino || "",
        dataHoraVoo: vooEditando.dataHoraVoo || "",
        assentosDisponiveis: vooEditando.assentosDisponiveis?.toString() || "",
        aeronaveId:
          (vooEditando.aeronave as Aeronave)?.id ||
          (vooEditando.aeronave as { id: string })?.id ||
          "",
      })
    }
  }, [vooEditando])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    // 3. Monta o payload exatamente como o @JsonIgnoreProperties do backend espera
    const payload: Voo = {
      origem: formData.origem.toUpperCase(),
      destino: formData.destino.toUpperCase(),
      dataHoraVoo: formData.dataHoraVoo,
      assentosDisponiveis: parseInt(formData.assentosDisponiveis, 10),
      aeronave: { id: formData.aeronaveId }, // Objeto aninhado para o Hibernate vincular
    }

    try {
      if (vooEditando?.id) {
        await vooService.atualizar(vooEditando.id, payload)
      } else {
        await vooService.criar(payload)
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
            Origem (Sigla)
          </label>
          <input
            required
            type="text"
            maxLength={3}
            placeholder="CWB"
            value={formData.origem}
            onChange={(e) =>
              setFormData({ ...formData, origem: e.target.value.toUpperCase() })
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm uppercase focus:ring-1 focus:ring-slate-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Destino (Sigla)
          </label>
          <input
            required
            type="text"
            maxLength={3}
            placeholder="GRU"
            value={formData.destino}
            onChange={(e) =>
              setFormData({
                ...formData,
                destino: e.target.value.toUpperCase(),
              })
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm uppercase focus:ring-1 focus:ring-slate-900 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Data e Hora
          </label>
          <input
            required
            type="datetime-local"
            value={formData.dataHoraVoo}
            onChange={(e) =>
              setFormData({ ...formData, dataHoraVoo: e.target.value })
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-1 focus:ring-slate-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Assentos Disponíveis
          </label>
          <input
            required
            type="number"
            min="1"
            placeholder="Ex: 150"
            value={formData.assentosDisponiveis}
            onChange={(e) =>
              setFormData({ ...formData, assentosDisponiveis: e.target.value })
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-1 focus:ring-slate-900 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Aeronave
        </label>
        <select
          required
          value={formData.aeronaveId}
          onChange={(e) =>
            setFormData({ ...formData, aeronaveId: e.target.value })
          }
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-1 focus:ring-slate-900 focus:outline-none"
        >
          <option value="">Selecione a aeronave...</option>
          {aeronaves.map((a) => (
            <option key={a.id} value={a.id}>
              {a.modelo} ({a.capacidadeAssentos} lugares)
            </option>
          ))}
        </select>
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
            : vooEditando
              ? "Atualizar Voo"
              : "Cadastrar Voo"}
        </button>
      </div>
    </form>
  )
}
