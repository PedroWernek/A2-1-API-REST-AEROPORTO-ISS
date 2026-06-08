import { useEffect, useState } from "react"
import { toast } from "sonner"
import { passagemService, Passagem } from "../../services/passagemService"
import { vooService, Voo } from "../../services/vooService"
import { passageiroService, Passageiro } from "../../services/passageiroService"
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
  const [voos, setVoos] = useState<Voo[]>([])
  const [passageiros, setPassageiros] = useState<Passageiro[]>([])
  const [formData, setFormData] = useState({
    assento: "",
    valor: "",
    vooId: "",
    passageiroId: "",
  })

  useEffect(() => {
    if (isOpen) {
      Promise.all([vooService.listar(), passageiroService.listar()])
        .then(([voosData, passageirosData]) => {
          setVoos(voosData)
          setPassageiros(passageirosData)
        })
        .catch(() => {})
    }
  }, [isOpen])

  useEffect(() => {
    if (passagemEditando && isOpen) {
      setFormData({
        assento: passagemEditando.assento,
        valor: passagemEditando.valor.toString(),
        vooId:
          (passagemEditando.voo as Voo)?.id ||
          (passagemEditando.voo as { id: string })?.id ||
          "",
        passageiroId:
          (passagemEditando.passageiro as Passageiro)?.id ||
          (passagemEditando.passageiro as { id: string })?.id ||
          "",
      })
    } else if (!isOpen) {
      setFormData({ assento: "", valor: "", vooId: "", passageiroId: "" })
    }
  }, [passagemEditando, isOpen])

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const payload: Passagem = {
      assento: formData.assento,
      valor: parseFloat(formData.valor),
      voo: { id: formData.vooId },
      passageiro: { id: formData.passageiroId },
    }

    try {
      if (passagemEditando?.id) {
        await passagemService.atualizar(passagemEditando.id, payload)
        toast.success("Passagem atualizada com sucesso!")
      } else {
        await passagemService.criar(payload)
        toast.success("Passagem emitida com sucesso!")
      }
      onSuccess()
    } catch (error) {
      toast.error("Erro ao salvar passagem.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {passagemEditando ? "Editar Passagem" : "Emitir Passagem"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="passageiro">Passageiro</Label>
              <Select
                value={formData.passageiroId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, passageiroId: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
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
            <div className="space-y-2">
              <Label htmlFor="voo">Voo</Label>
              <Select
                value={formData.vooId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, vooId: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {voos.map((v) => (
                    <SelectItem key={v.id} value={v.id!}>
                      {v.origem} - {v.destino}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assento">Assento</Label>
              <Input
                id="assento"
                required
                value={formData.assento}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    assento: e.target.value.toUpperCase(),
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valor">Valor</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                required
                value={formData.valor}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, valor: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-slate-900 text-white">
              Confirmar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
