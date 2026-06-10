import { useEffect, useState } from "react"
import { toast } from "sonner"
import {
  Ticket,
  User,
  PlaneTakeoff,
  CircleDollarSign,
  Loader2,
  Armchair,
} from "lucide-react"
import { passagemService, Passagem } from "../../services/passagemService"
import { passageiroService, Passageiro } from "../../services/passageiroService"
import { vooService, Voo } from "../../services/vooService"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../../components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"

// Formatar a data para algo legível (Ex: 15/06/2026 às 14:30)
const formatarDataVisivel = (dataJava: string) => {
  if (!dataJava) return ""
  const limpa = dataJava.replace("T", " ")
  const partes = limpa.split(" ")
  if (partes.length !== 2) return limpa

  const [ano, mes, dia] = partes[0].split("-")
  const hora = partes[1].substring(0, 5)
  return `${dia}/${mes}/${ano} às ${hora}`
}

interface PassagemFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  passagemEditando?: Passagem | null
}

export function PassagemFormModal({
  isOpen,
  onClose,
  onSuccess,
  passagemEditando,
}: PassagemFormModalProps) {
  const [passageiros, setPassageiros] = useState<Passageiro[]>([])
  const [voos, setVoos] = useState<Voo[]>([])
  const [todasPassagens, setTodasPassagens] = useState<Passagem[]>([])

  const [loading, setLoading] = useState(false)
  const [carregandoDados, setCarregandoDados] = useState(false)

  const [formData, setFormData] = useState({
    passageiroId: "",
    vooId: "",
    assento: "",
    valor: "",
  })

  useEffect(() => {
    if (isOpen) {
      setCarregandoDados(true)

      Promise.all([
        passageiroService.listar(),
        vooService.listar(),
        passagemService.listar(),
      ])
        .then(([passData, voosData, passagensData]) => {
          setPassageiros(passData || [])
          setVoos(voosData || [])
          setTodasPassagens(passagensData || [])
        })
        .catch(() => toast.error("Falha ao sincronizar dados com o servidor."))
        .finally(() => setCarregandoDados(false))
    }
  }, [isOpen])

  useEffect(() => {
    if (passagemEditando && isOpen) {
      setFormData({
        passageiroId:
          (passagemEditando.passageiro as Passageiro)?.id ||
          (passagemEditando.passageiro as any)?.id ||
          "",
        vooId:
          (passagemEditando.voo as Voo)?.id ||
          (passagemEditando.voo as any)?.id ||
          "",
        assento: passagemEditando.assento || "",
        valor: passagemEditando.valor?.toString() || "",
      })
    } else if (!isOpen) {
      setFormData({ passageiroId: "", vooId: "", assento: "", valor: "" })
    }
  }, [passagemEditando, isOpen])

  const vooSelecionado = voos.find((v) => v.id === formData.vooId)

  const assentosOcupados = todasPassagens
    .filter(
      (p) => ((p.voo as Voo)?.id || (p.voo as any)?.id) === formData.vooId
    )
    .map((p) => p.assento)

  const renderBotaoAssento = (
    row: number,
    letra: string,
    maxCapacidade: number
  ) => {
    const letrasMap = { A: 1, B: 2, C: 3, D: 4 }
    const assentoIndex =
      (row - 1) * 4 + letrasMap[letra as keyof typeof letrasMap]

    if (assentoIndex > maxCapacidade) return <div className="h-9 w-9" />

    const seatId = `${row}${letra}`
    const isSelected = formData.assento === seatId

    const isOccupied =
      assentosOcupados.includes(seatId) && passagemEditando?.assento !== seatId

    return (
      <button
        type="button"
        disabled={isOccupied || loading} // ALTERAÇÃO: Bloqueia clique no assento se estiver salvando
        onClick={() => setFormData((prev) => ({ ...prev, assento: seatId }))}
        title={isOccupied ? `Ocupado` : `Selecionar ${seatId}`}
        className={`relative flex h-9 w-9 flex-col items-center justify-center rounded-t-lg rounded-b-sm text-xs font-bold transition-all ${
          isOccupied
            ? "cursor-not-allowed border border-slate-300 bg-slate-200 text-slate-400 line-through"
            : isSelected
              ? "-translate-y-1 transform border-b-4 border-blue-800 bg-blue-600 text-white shadow-md"
              : "border border-b-4 border-slate-300 border-b-slate-400 bg-white text-slate-600 hover:-translate-y-0.5 hover:bg-slate-50"
        }`}
      >
        {letra}
      </button>
    )
  }

  const renderMapaAviao = () => {
    if (!vooSelecionado) {
      return (
        <div className="flex h-full flex-col items-center justify-center text-slate-400">
          <Armchair className="mb-2 h-12 w-12 opacity-20" />
          <p className="text-sm">Selecione um voo primeiro</p>
        </div>
      )
    }

    const capacidade =
      (vooSelecionado.aeronave as any)?.capacidadeAssentos || 60
    const totalRows = Math.ceil(capacidade / 4)
    const rowsArray = []

    for (let r = 1; r <= totalRows; r++) {
      rowsArray.push(
        <div key={r} className="mb-3 flex items-center justify-center gap-4">
          <div className="flex gap-1.5">
            {renderBotaoAssento(r, "A", capacidade)}
            {renderBotaoAssento(r, "B", capacidade)}
          </div>
          <div className="w-6 text-center text-[10px] font-bold text-slate-400">
            {r}
          </div>
          <div className="flex gap-1.5">
            {renderBotaoAssento(r, "C", capacidade)}
            {renderBotaoAssento(r, "D", capacidade)}
          </div>
        </div>
      )
    }

    return (
      <div className="flex flex-col items-center pb-6">
        <div className="mb-8 flex h-16 w-32 items-end justify-center rounded-t-[100%] border border-slate-300 bg-white pb-2 shadow-sm">
          <span className="text-[10px] font-bold tracking-widest text-slate-400">
            CABINE
          </span>
        </div>
        {rowsArray}
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.assento) {
      toast.error("Por favor, selecione um assento no mapa da aeronave.")
      return
    }

    setLoading(true)

    const payload: Passagem = {
      assento: formData.assento,
      valor: parseFloat(formData.valor),
      voo: { id: formData.vooId },
      passageiro: { id: formData.passageiroId },
    }

    try {
      if (passagemEditando?.id) {
        await passagemService.atualizar(passagemEditando.id, payload)
        toast.success("Bilhete atualizado!")
      } else {
        await passagemService.criar(payload)
        toast.success("Bilhete emitido com sucesso!")
      }
      onSuccess()
    } catch (error) {
      toast.error("Erro ao emitir bilhete.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            {passagemEditando ? "Editar Bilhete" : "Emissão de Bilhete de Voo"}
          </DialogTitle>
          <DialogDescription className="hidden">
            Selecione o passageiro, o voo e o assento pretendido no mapa.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="pt-2">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-5">
              <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="passageiro"
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4 text-slate-400" /> Passageiro
                    Titular
                    {carregandoDados && (
                      <Loader2 className="ml-auto h-3 w-3 animate-spin text-slate-400" />
                    )}
                  </Label>
                  <Select
                    value={formData.passageiroId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, passageiroId: value }))
                    }
                    required
                    disabled={carregandoDados || loading} // ALTERAÇÃO AQUI
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue
                        placeholder={
                          carregandoDados
                            ? "A carregar..."
                            : "Selecione o passageiro"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {passageiros.map((p) => (
                        <SelectItem key={p.id} value={p.id!}>
                          {p.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="voo" className="flex items-center gap-2">
                    <PlaneTakeoff className="h-4 w-4 text-slate-400" /> Voo
                    Desejado
                    {carregandoDados && (
                      <Loader2 className="ml-auto h-3 w-3 animate-spin text-slate-400" />
                    )}
                  </Label>
                  <Select
                    value={formData.vooId}
                    onValueChange={(value) => {
                      setFormData((prev) => ({
                        ...prev,
                        vooId: value,
                        assento: "",
                      }))
                    }}
                    required
                    disabled={carregandoDados || loading} // ALTERAÇÃO AQUI
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue
                        placeholder={
                          carregandoDados ? "A carregar..." : "Selecione o voo"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {voos.map((v) => (
                        <SelectItem
                          key={v.id}
                          value={v.id!}
                          disabled={
                            v.assentosDisponiveis === 0 && !passagemEditando
                          }
                        >
                          {v.origem} → {v.destino} |{" "}
                          {formatarDataVisivel(v.dataHoraVoo)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="space-y-1.5">
                  <Label htmlFor="valor" className="flex items-center gap-2">
                    <CircleDollarSign className="h-4 w-4 text-slate-400" />{" "}
                    Valor do Bilhete (R$)
                  </Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="0.00"
                    value={formData.valor}
                    disabled={loading} // ALTERAÇÃO AQUI
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        valor: e.target.value,
                      }))
                    }
                    className="bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="assento">Assento Selecionado</Label>
                  <Input
                    id="assento"
                    readOnly
                    placeholder="Clique no mapa ao lado..."
                    value={formData.assento}
                    disabled={loading} // ALTERAÇÃO AQUI
                    className="cursor-default border-dashed bg-slate-200/50 font-bold text-slate-700"
                  />
                  <p className="text-[11px] text-slate-500">
                    *A seleção é feita interativamente através do mapa ao lado.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex h-full flex-col">
              <Label className="mb-2 flex items-center gap-2 tracking-wider text-slate-500 uppercase">
                <Armchair className="h-4 w-4" /> Mapa da Aeronave
              </Label>
              <div className="relative h-[420px] flex-1 overflow-y-auto rounded-xl border border-slate-200 bg-slate-100 shadow-inner">
                {carregandoDados ? (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  renderMapaAviao()
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6 border-t pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading} // ALTERAÇÃO AQUI
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || carregandoDados}
              className="min-w-[140px] bg-slate-900 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : passagemEditando ? (
                "Atualizar Bilhete"
              ) : (
                "Emitir Bilhete"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
