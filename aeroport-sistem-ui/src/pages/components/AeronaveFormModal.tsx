import { useEffect, useState } from "react"
import { toast } from "sonner"
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
  DialogDescription
} from "../../components/ui/dialog"

interface AeronaveFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  aeronaveEditando?: Aeronave | null
}

export function AeronaveFormModal({
  isOpen,
  onClose,
  onSuccess,
  aeronaveEditando,
}: AeronaveFormModalProps) {
  const [formData, setFormData] = useState<Aeronave>({
    tipo: "",
    capacidadeAssentos: 0,
    modelo: "",
  })

  useEffect(() => {
    if (aeronaveEditando && isOpen) {
      setFormData(aeronaveEditando)
    } else if (!isOpen) {
      setFormData({ tipo: "", capacidadeAssentos: 0, modelo: "" })
    }
  }, [aeronaveEditando, isOpen])

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (aeronaveEditando?.id) {
        await aeronaveService.atualizar(aeronaveEditando.id, formData)
        toast.success("Aeronave atualizada com sucesso!")
      } else {
        await aeronaveService.criar(formData)
        toast.success("Nova aeronave cadastrada!")
      }
      onSuccess()
    } catch (error) {
      toast.error("Erro ao salvar aeronave.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {aeronaveEditando ? "Editar aeronave" : "Novo aeronave"}
          </DialogTitle>

          {/* CORREÇÃO AQUI: Adicionar a descrição obrigatória (escondida ou visível) */}
          <DialogDescription className="hidden">
            Preencha os dados do aeronave para registar no sistema.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="modelo">Modelo</Label>
            <Input
              id="modelo"
              required
              value={formData.modelo}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, modelo: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo</Label>
            <Input
              id="tipo"
              required
              value={formData.tipo}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, tipo: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacidade">Capacidade de Assentos</Label>
            <Input
              id="capacidade"
              type="number"
              required
              min="1"
              value={formData.capacidadeAssentos || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  capacidadeAssentos: Number(e.target.value),
                }))
              }
            />
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-slate-900 text-white">
              Salvar Aeronave
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
