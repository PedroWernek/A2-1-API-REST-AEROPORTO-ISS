import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Map, Overlay } from "pigeon-maps"
import {
  MapPin,
  Navigation,
  CalendarClock,
  Users,
  PlaneTakeoff,
  Loader2,
} from "lucide-react"
import { vooService, Voo } from "../../services/vooService"
import { aeronaveService, Aeronave } from "../../services/aeronaveService"
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

const formatDateTimeParaJava = (htmlDate: string) => {
  if (!htmlDate) return ""
  let formatado = htmlDate.replace("T", " ")
  if (formatado.length === 16) formatado += ":00"
  return formatado
}

const formatDateTimeParaHtml = (javaDate: string) => {
  if (!javaDate) return ""
  return javaDate.replace(" ", "T").substring(0, 16)
}

// Base de dados para o mapa
const AEROPORTOS = [
  { nome: "Curitiba", lat: -25.5327, lng: -49.1724 },
  { nome: "Guarulhos", lat: -23.4356, lng: -46.4731 },
  { nome: "Congonhas", lat: -23.6273, lng: -46.6566 },
  { nome: "Rio de Janeiro", lat: -22.81, lng: -43.2533 },
  { nome: "Brasília", lat: -15.8697, lng: -47.9172 },
  { nome: "Salvador", lat: -12.9111, lng: -38.3311 },
  { nome: "Recife", lat: -8.1258, lng: -34.9211 },
  { nome: "Porto Alegre", lat: -29.9939, lng: -51.1711 },
  { nome: "Manaus", lat: -3.0369, lng: -60.0497 },
]

interface VooFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  vooEditando?: Voo | null
}

export function VooFormModal({
  isOpen,
  onClose,
  onSuccess,
  vooEditando,
}: VooFormModalProps) {
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([])
  const [loading, setLoading] = useState(false)
  const [carregandoAeronaves, setCarregandoAeronaves] = useState(false)
  const [selecaoMapa, setSelecaoMapa] = useState<"origem" | "destino">("origem")

  const [formData, setFormData] = useState({
    origem: "",
    destino: "",
    dataHoraVoo: "",
    assentosDisponiveis: "",
    aeronaveId: "",
  })

  useEffect(() => {
    if (isOpen) {
      setCarregandoAeronaves(true)
      aeronaveService
        .listar()
        .then(setAeronaves)
        .catch(() => toast.error("Não foi possível carregar a frota."))
        .finally(() => setCarregandoAeronaves(false))

      setSelecaoMapa("origem")
    }
  }, [isOpen])

  useEffect(() => {
    if (vooEditando && isOpen) {
      setFormData({
        origem: vooEditando.origem,
        destino: vooEditando.destino,
        dataHoraVoo: formatDateTimeParaHtml(vooEditando.dataHoraVoo),
        assentosDisponiveis: vooEditando.assentosDisponiveis?.toString(),
        aeronaveId:
          (vooEditando.aeronave as Aeronave)?.id ||
          (vooEditando.aeronave as { id: string })?.id ||
          "",
      })
    } else if (!isOpen) {
      setFormData({
        origem: "",
        destino: "",
        dataHoraVoo: "",
        assentosDisponiveis: "",
        aeronaveId: "",
      })
    }
  }, [vooEditando, isOpen])

  // Lógica de clique no mapa alterada para usar o nome completo
  const handleMapClick = (aeroporto: (typeof AEROPORTOS)[0]) => {
    if (selecaoMapa === "origem") {
      setFormData((prev) => ({ ...prev, origem: aeroporto.nome }))
      toast.success(`Origem definida: ${aeroporto.nome}`)
      setSelecaoMapa("destino")
    } else {
      setFormData((prev) => ({ ...prev, destino: aeroporto.nome }))
      toast.success(`Destino definido: ${aeroporto.nome}`)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    // Envia a string exata que está no campo, sem forçar uppercase ou limites
    const payload: Voo = {
      origem: formData.origem,
      destino: formData.destino,
      dataHoraVoo: formatDateTimeParaJava(formData.dataHoraVoo),
      assentosDisponiveis: Number(formData.assentosDisponiveis),
      aeronave: { id: formData.aeronaveId },
    }

    try {
      if (vooEditando?.id) {
        await vooService.atualizar(vooEditando.id, payload)
        toast.success("Voo atualizado com sucesso!")
      } else {
        await vooService.criar(payload)
        toast.success("Voo cadastrado com sucesso!")
      }
      onSuccess()
    } catch (error) {
      toast.error("Erro ao salvar voo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PlaneTakeoff className="h-5 w-5" />
            {vooEditando ? "Editar Voo" : "Programar Novo Voo"}
          </DialogTitle>
          <DialogDescription className="hidden">
            Preencha os dados do voo e selecione a rota no mapa.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          {/* SECÇÃO 1: MAPA E ROTA */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="h-4 w-4 text-slate-500" />
                <Label className="tracking-wider text-slate-500 uppercase">
                  Seleção de Rota
                </Label>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={selecaoMapa === "origem" ? "default" : "secondary"}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setSelecaoMapa("origem")}
                >
                  Definir Origem
                </Button>
                <Button
                  type="button"
                  variant={selecaoMapa === "destino" ? "default" : "secondary"}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setSelecaoMapa("destino")}
                >
                  Definir Destino
                </Button>
              </div>
            </div>

            <div className="mb-4 h-[220px] w-full overflow-hidden rounded-md border border-slate-300">
              <Map defaultCenter={[-15.0, -50.0]} defaultZoom={4} minZoom={3}>
                {AEROPORTOS.map((aeroporto) => (
                  <Overlay
                    key={aeroporto.nome}
                    anchor={[aeroporto.lat, aeroporto.lng]}
                    offset={[12, 24]}
                  >
                    <div
                      onClick={() => handleMapClick(aeroporto)}
                      className="group relative cursor-pointer transition-transform hover:scale-125"
                    >
                      <MapPin
                        className={`h-7 w-7 drop-shadow-md ${
                          formData.origem === aeroporto.nome
                            ? "text-blue-600"
                            : formData.destino === aeroporto.nome
                              ? "text-red-600"
                              : "text-slate-700"
                        }`}
                        fill="currentColor"
                        stroke="white"
                      />
                      <div className="absolute top-7 left-1/2 z-50 hidden -translate-x-1/2 rounded bg-slate-900 px-2 py-1 text-[10px] whitespace-nowrap text-white opacity-90 shadow group-hover:block">
                        {aeroporto.nome}
                      </div>
                    </div>
                  </Overlay>
                ))}
              </Map>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="origem">Local de Origem</Label>
                <Input
                  id="origem"
                  required
                  placeholder="Ex: Curitiba"
                  value={formData.origem}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, origem: e.target.value }))
                  }
                  className="border-blue-200 font-semibold focus-visible:ring-blue-500"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="destino">Local de Destino</Label>
                <Input
                  id="destino"
                  required
                  placeholder="Ex: São Paulo"
                  value={formData.destino}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      destino: e.target.value,
                    }))
                  }
                  className="border-red-200 font-semibold focus-visible:ring-red-500"
                />
              </div>
            </div>
          </div>

          {/* SECÇÃO 2: LOGÍSTICA E DATA */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="dataHoraVoo"
                  className="flex items-center gap-2"
                >
                  <CalendarClock className="h-4 w-4 text-slate-400" /> Data e
                  Hora
                </Label>
                <Input
                  id="dataHoraVoo"
                  type="datetime-local"
                  required
                  value={formData.dataHoraVoo}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dataHoraVoo: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assentos" className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-400" /> Assentos Livres
                </Label>
                <Input
                  id="assentos"
                  type="number"
                  required
                  min="1"
                  value={formData.assentosDisponiveis}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      assentosDisponiveis: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor="aeronave" className="flex items-center gap-2">
                Aeronave Destinada
                {carregandoAeronaves && (
                  <Loader2 className="h-3 w-3 animate-spin text-slate-400" />
                )}
              </Label>
              <Select
                value={formData.aeronaveId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, aeronaveId: value }))
                }
                required
                disabled={carregandoAeronaves}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue
                    placeholder={
                      carregandoAeronaves
                        ? "A carregar frota..."
                        : "Selecione a aeronave..."
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {aeronaves.length === 0 && !carregandoAeronaves ? (
                    <div className="p-2 text-sm text-slate-500">
                      Nenhuma aeronave disponível.
                    </div>
                  ) : (
                    aeronaves.map((a) => (
                      <SelectItem key={a.id} value={a.id!}>
                        {a.modelo} - {a.tipo} ({a.capacidadeAssentos} lugares)
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="min-w-[120px] bg-slate-900 text-white"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Salvar Voo"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
