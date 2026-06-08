import { useEffect, useState } from "react"
import { toast } from "sonner"
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
} from "../../components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"

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
  const [formData, setFormData] = useState({
    origem: "",
    destino: "",
    dataHoraVoo: "",
    assentosDisponiveis: 0,
    aeronaveId: "",
  })

  useEffect(() => {
    if (isOpen) {
      aeronaveService
        .listar()
        .then(setAeronaves)
        .catch(() => {})
    }
  }, [isOpen])

  useEffect(() => {
    if (vooEditando && isOpen) {
      setFormData({
        origem: vooEditando.origem,
        destino: vooEditando.destino,
        dataHoraVoo: vooEditando.dataHoraVoo,
        assentosDisponiveis: vooEditando.assentosDisponiveis,
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
        assentosDisponiveis: 0,
        aeronaveId: "",
      })
    }
  }, [vooEditando, isOpen])

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const payload: Voo = {
      origem: formData.origem,
      destino: formData.destino,
      dataHoraVoo: formData.dataHoraVoo,
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
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{vooEditando ? "Editar Voo" : "Novo Voo"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origem">Origem</Label>
              <Input
                id="origem"
                required
                value={formData.origem}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, origem: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destino">Destino</Label>
              <Input
                id="destino"
                required
                value={formData.destino}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, destino: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dataHoraVoo">Data e Hora</Label>
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assentos">Assentos Disponíveis</Label>
              <Input
                id="assentos"
                type="number"
                required
                min="1"
                value={formData.assentosDisponiveis || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    assentosDisponiveis: Number(e.target.value),
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aeronave">Aeronave</Label>
              <Select
                value={formData.aeronaveId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, aeronaveId: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {aeronaves.map((a) => (
                    <SelectItem key={a.id} value={a.id!}>
                      {a.modelo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-slate-900 text-white">
              Salvar Voo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
