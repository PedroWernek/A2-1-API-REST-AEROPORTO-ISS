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
  DialogDescription,
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

  // NOVO ESTADO: Controla se está salvando no momento
  const [isSaving, setIsSaving] = useState(false)

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

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cepDigitado = e.target.value.replace(/\D/g, "")

    if (cepDigitado.length < 8) {
      setFormData((prev) => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          cep: cepDigitado,
          logradouro: "",
          bairro: "",
          localidade: "",
          uf: "",
        },
      }))
      return
    }

    if (cepDigitado.length === 8) {
      setFormData((prev) => ({
        ...prev,
        endereco: { ...prev.endereco, cep: cepDigitado },
      }))

      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cepDigitado}/json/`
        )
        const data = await response.json()

        if (data.erro) {
          toast.error("CEP não encontrado.")
          setFormData((prev) => ({
            ...prev,
            endereco: {
              ...prev.endereco,
              logradouro: "",
              bairro: "",
              localidade: "",
              uf: "",
            },
          }))
          return
        }

        setFormData((prev) => ({
          ...prev,
          endereco: {
            cep: cepDigitado,
            logradouro: data.logradouro || "",
            bairro: data.bairro || "",
            localidade: data.localidade || "",
            uf: data.uf || "",
          },
        }))
        toast.success("Endereço encontrado!")
      } catch (error) {
        console.error("Erro ao buscar CEP:", error)
        toast.error("Erro ao buscar o CEP na base de dados.")

        setFormData((prev) => ({
          ...prev,
          endereco: {
            ...prev.endereco,
            logradouro: "",
            bairro: "",
            localidade: "",
            uf: "",
          },
        }))
      }
    }
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true) // Inicia o estado de salvamento

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
    } finally {
      setIsSaving(false) // Finaliza o estado de salvamento (independente de dar erro ou sucesso)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {passageiroEditando ? "Editar Passageiro" : "Novo Passageiro"}
          </DialogTitle>

          <DialogDescription className="hidden">
            Preencha os dados do passageiro para registrar no sistema.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
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
                  disabled={isSaving}
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
                  disabled={isSaving}
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
                  maxLength={9}
                  placeholder="Apenas números"
                  disabled={isSaving}
                  value={formData.endereco.cep}
                  onChange={handleCepChange}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="logradouro">Rua / Logradouro</Label>
                <Input
                  id="logradouro"
                  required
                  disabled={isSaving}
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
                  disabled={isSaving}
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
                  disabled={isSaving}
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
                  disabled={isSaving}
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
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            {/* O BOTÃO AGORA MUDA DE ESTADO */}
            <Button
              type="submit"
              className="bg-slate-900 text-white"
              disabled={isSaving}
            >
              {isSaving ? "Salvando..." : "Salvar Passageiro"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
