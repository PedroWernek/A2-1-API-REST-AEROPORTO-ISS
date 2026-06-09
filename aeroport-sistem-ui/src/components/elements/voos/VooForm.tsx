import { useState, useEffect } from "react"
import {
  PlaneTakeoff,
  MapPin,
  CalendarClock,
  Users,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import { vooService, Voo } from "../../../services/vooService"
import { aeronaveService, Aeronave } from "../../../services/aeronaveService"

// Converte do formato HTML ("2026-06-15T14:30") para o formato Java/SQL ("2026-06-15 14:30:00")
const formatDateTimeParaJava = (htmlDate: string) => {
  if (!htmlDate) return ""
  let formatado = htmlDate.replace("T", " ")
  if (formatado.length === 16) formatado += ":00"
  return formatado
}

// Converte do formato Java/SQL ("2026-06-15 14:30:00") para o formato HTML ("2026-06-15T14:30")
const formatDateTimeParaHtml = (javaDate: string) => {
  if (!javaDate) return ""
  return javaDate.replace(" ", "T").substring(0, 16)
}

interface VooFormProps {
  vooEditando?: Voo | null
  onSuccess: () => void
  onCancel: () => void
}

export function VooForm({ vooEditando, onSuccess, onCancel }: VooFormProps) {
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([])

  const [formData, setFormData] = useState({
    origem: "",
    destino: "",
    dataHoraVoo: "",
    assentosDisponiveis: "",
    aeronaveId: "",
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    aeronaveService.listar().then(setAeronaves).catch(console.error)

    if (vooEditando) {
      setFormData({
        origem: vooEditando.origem || "",
        destino: vooEditando.destino || "",
        // Aplica a conversão ao carregar para o input entender a data
        dataHoraVoo: formatDateTimeParaHtml(vooEditando.dataHoraVoo || ""),
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

    const payload: Voo = {
      origem: formData.origem.toUpperCase(),
      destino: formData.destino.toUpperCase(),
      // Aplica a conversão ao enviar para o Java não dar erro de Timestamp
      dataHoraVoo: formatDateTimeParaJava(formData.dataHoraVoo),
      assentosDisponiveis: parseInt(formData.assentosDisponiveis, 10),
      aeronave: { id: formData.aeronaveId },
    }

    try {
      if (vooEditando?.id) {
        await vooService.atualizar(vooEditando.id, payload)
        toast.success("Voo atualizado com sucesso!")
      } else {
        await vooService.criar(payload)
        toast.success("Voo programado com sucesso!")
      }
      onSuccess()
    } catch (error) {
      console.error(error)
      toast.error("Erro ao guardar o voo no sistema.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* SEÇÃO 1: ROTA */}
      <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
        <div className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
          <MapPin className="h-5 w-5 text-slate-500" />
          <h3 className="text-sm font-semibold tracking-wider text-slate-700 uppercase">
            Plano de Rota
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label
              htmlFor="origem"
              className="text-sm font-medium text-slate-700"
            >
              Origem (Sigla)
            </label>
            <input
              id="origem"
              required
              type="text"
              maxLength={3}
              placeholder="Ex: CWB"
              value={formData.origem}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  origem: e.target.value.toUpperCase(),
                })
              }
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm uppercase transition-colors focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="destino"
              className="text-sm font-medium text-slate-700"
            >
              Destino (Sigla)
            </label>
            <input
              id="destino"
              required
              type="text"
              maxLength={3}
              placeholder="Ex: GRU"
              value={formData.destino}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  destino: e.target.value.toUpperCase(),
                })
              }
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm uppercase transition-colors focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* SEÇÃO 2: LOGÍSTICA E ALOCAÇÃO */}
      <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
        <div className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
          <PlaneTakeoff className="h-5 w-5 text-slate-500" />
          <h3 className="text-sm font-semibold tracking-wider text-slate-700 uppercase">
            Alocação de Voo
          </h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="dataHoraVoo"
                className="flex items-center gap-2 text-sm font-medium text-slate-700"
              >
                <CalendarClock className="h-4 w-4 text-slate-400" /> Data e Hora
                de Partida
              </label>
              <input
                id="dataHoraVoo"
                required
                type="datetime-local"
                value={formData.dataHoraVoo}
                onChange={(e) =>
                  setFormData({ ...formData, dataHoraVoo: e.target.value })
                }
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm transition-colors focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="assentos"
                className="flex items-center gap-2 text-sm font-medium text-slate-700"
              >
                <Users className="h-4 w-4 text-slate-400" /> Assentos
                Disponíveis
              </label>
              <input
                id="assentos"
                required
                type="number"
                min="1"
                placeholder="Ex: 150"
                value={formData.assentosDisponiveis}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assentosDisponiveis: e.target.value,
                  })
                }
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm transition-colors focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="aeronave"
              className="text-sm font-medium text-slate-700"
            >
              Aeronave Destinada
            </label>
            <select
              id="aeronave"
              required
              value={formData.aeronaveId}
              onChange={(e) =>
                setFormData({ ...formData, aeronaveId: e.target.value })
              }
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm transition-colors focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            >
              <option value="" disabled>
                Selecione a aeronave...
              </option>
              {aeronaves.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.modelo} - {a.tipo} ({a.capacidadeAssentos} lugares totais)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* SEÇÃO 3: AÇÕES */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 focus:outline-none"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:outline-none disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />A Sincronizar...
            </>
          ) : vooEditando ? (
            "Atualizar Detalhes"
          ) : (
            "Programar Voo"
          )}
        </button>
      </div>
    </form>
  )
}
