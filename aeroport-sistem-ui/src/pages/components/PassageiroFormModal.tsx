import { useEffect, useState } from "react"
import { toast } from "sonner"
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

interface PassageiroFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  passageiroEditando?: Passageiro | null
}

export function PassageiroFormModal({
  isOpen,
  onClose,
  onSuccess,
  passageiroEditando,
}: PassageiroFormModalProps) {
  // O Estado reflete EXATAMENTE o que o Java espera
  const [formData, setFormData] = useState<Passageiro>({
    nome: "",
    cpf: "",
    endereco: {
      cep: "",
      logradouro: "",
      bairro: "",
      localidade: "",
      uf: "",
    },
  })

  // Preenche o formulário ao abrir para edição ou limpa ao fechar
  useEffect(() => {
    if (passageiroEditando && isOpen) {
      setFormData(passageiroEditando)
    } else if (!isOpen) {
      setFormData({
        nome: "",
        cpf: "",
        endereco: {
          cep: "",
          logradouro: "",
          bairro: "",
          localidade: "",
          uf: "",
        },
      })
    }
  }, [passageiroEditando, isOpen])

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (passageiroEditando?.id) {
        await passageiroService.atualizar(passageiroEditando.id, formData)
        toast.success("Passageiro atualizado com sucesso!")
      } else {
        await passageiroService.criar(formData)
        toast.success("Passageiro cadastrado com sucesso!")
      }
      onSuccess()
    } catch (error) {
      console.error("Erro ao salvar passageiro:", error)
      toast.error("Erro ao salvar passageiro.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* max-w-2xl deixa o modal mais largo para caber os campos de endereço */}
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {passageiroEditando ? "Editar Passageiro" : "Novo Passageiro"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* SESSÃO: DADOS PESSOAIS */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium tracking-wider text-slate-500 uppercase">
              Dados Pessoais
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  required
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, nome: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  required
                  value={formData.cpf}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, cpf: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          <div className="space-y-4">
            <h4 className="text-sm font-medium tracking-wider text-slate-500 uppercase">
              Endereço
            </h4>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1 space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  required
                  value={formData.endereco.cep}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endereco: { ...prev.endereco, cep: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="logradouro">Rua / Logradouro</Label>
                <Input
                  id="logradouro"
                  required
                  value={formData.endereco.logradouro}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endereco: {
                        ...prev.endereco,
                        logradouro: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  required
                  value={formData.endereco.bairro}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endereco: { ...prev.endereco, bairro: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="localidade">Cidade</Label>
                <Input
                  id="localidade"
                  required
                  value={formData.endereco.localidade}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endereco: {
                        ...prev.endereco,
                        localidade: e.target.value,
                      },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uf">UF (Estado)</Label>
                <Input
                  id="uf"
                  required
                  maxLength={2}
                  className="uppercase"
                  value={formData.endereco.uf}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endereco: {
                        ...prev.endereco,
                        uf: e.target.value.toUpperCase(),
                      },
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-slate-900 text-white">
              Salvar Passageiro
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
