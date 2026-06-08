import { useState, useEffect } from "react"
import { User, MapPin, CreditCard, Loader2 } from "lucide-react"
import { toast } from "sonner" // <-- Importamos o toast para dar avisos
import {
  passageiroService,
  Passageiro,
} from "../../../services/passageiroService"

// Funções utilitárias para aplicar máscaras nos inputs
const maskCPF = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1")
}

const maskCEP = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{3})\d+?$/, "$1")
}

interface PassageiroFormProps {
  passageiroEditando?: Passageiro | null
  onSuccess: () => void
  onCancel: () => void
}

export function PassageiroForm({
  passageiroEditando,
  onSuccess,
  onCancel,
}: PassageiroFormProps) {
  const [formData, setFormData] = useState<Passageiro>({
    nome: "",
    cpf: "",
    endereco: { cep: "", logradouro: "", bairro: "", localidade: "", uf: "" },
  })

  const [loading, setLoading] = useState(false)
  const [buscandoCep, setBuscandoCep] = useState(false) // Estado para mostrar que o CEP está a carregar

  useEffect(() => {
    if (passageiroEditando) {
      setFormData({
        nome: passageiroEditando.nome || "",
        cpf: maskCPF(passageiroEditando.cpf || ""),
        endereco: passageiroEditando.endereco || {
          cep: "",
          logradouro: "",
          bairro: "",
          localidade: "",
          uf: "",
        },
      })
    }
  }, [passageiroEditando])

  // A MAGIA DO CEP ACONTECE AQUI:
  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    const maskedCep = maskCEP(rawValue)
    const apenasNumeros = rawValue.replace(/\D/g, "")

    // 1. Atualiza o que o utilizador vê enquanto digita
    setFormData((prev) => ({
      ...prev,
      endereco: { ...prev.endereco, cep: maskedCep },
    }))

    // 2. Se chegou a 8 números, dispara a busca automática
    if (apenasNumeros.length === 8) {
      setBuscandoCep(true)
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${apenasNumeros}/json/`
        )
        const data = await response.json()

        if (data.erro) {
          toast.error("CEP não encontrado.")
        } else {
          // Preenche automaticamente o resto do formulário
          setFormData((prev) => ({
            ...prev,
            endereco: {
              ...prev.endereco,
              logradouro: data.logradouro || "",
              bairro: data.bairro || "",
              localidade: data.localidade || "",
              uf: data.uf || "",
            },
          }))
          toast.success("Endereço preenchido automaticamente!")
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error)
        toast.error("Falha ao comunicar com o serviço de CEP.")
      } finally {
        setBuscandoCep(false)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const payloadParaSalvar: Passageiro = {
      ...formData,
      cpf: formData.cpf.replace(/\D/g, ""),
      endereco: {
        ...formData.endereco,
        cep: formData.endereco.cep.replace(/\D/g, ""),
      },
    }

    try {
      if (passageiroEditando?.id) {
        await passageiroService.atualizar(
          passageiroEditando.id,
          payloadParaSalvar
        )
        toast.success("Passageiro atualizado com sucesso!")
      } else {
        await passageiroService.criar(payloadParaSalvar)
        toast.success("Passageiro cadastrado com sucesso!")
      }
      onSuccess()
    } catch (error) {
      console.error(error)
      toast.error("Ocorreu um erro ao guardar o passageiro.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* SEÇÃO 1: DADOS PESSOAIS */}
      <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
        <div className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
          <User className="h-5 w-5 text-slate-500" />
          <h3 className="text-sm font-semibold tracking-wider text-slate-700 uppercase">
            Dados Pessoais
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label
              htmlFor="nome"
              className="text-sm font-medium text-slate-700"
            >
              Nome Completo
            </label>
            <input
              id="nome"
              required
              type="text"
              placeholder="Ex: Pedro de Castilho"
              value={formData.nome}
              onChange={(e) =>
                setFormData({ ...formData, nome: e.target.value })
              }
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm transition-colors focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="cpf" className="text-sm font-medium text-slate-700">
              CPF
            </label>
            <div className="relative">
              <CreditCard className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
              <input
                id="cpf"
                required
                type="text"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={(e) =>
                  setFormData({ ...formData, cpf: maskCPF(e.target.value) })
                }
                className="w-full rounded-md border border-slate-300 bg-white py-2 pr-3 pl-9 text-sm transition-colors focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO 2: ENDEREÇO */}
      <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
        <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-slate-500" />
            <h3 className="text-sm font-semibold tracking-wider text-slate-700 uppercase">
              Endereço
            </h3>
          </div>
          {buscandoCep && (
            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
          )}
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-1.5 md:col-span-1">
              <label
                htmlFor="cep"
                className="text-sm font-medium text-slate-700"
              >
                CEP
              </label>
              <input
                id="cep"
                required
                type="text"
                placeholder="00000-000"
                value={formData.endereco.cep}
                onChange={handleCepChange} // <-- Substituímos aqui para usar a nossa nova função
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm transition-colors focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none disabled:bg-slate-100"
                disabled={buscandoCep}
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label
                htmlFor="logradouro"
                className="text-sm font-medium text-slate-700"
              >
                Logradouro / Rua
              </label>
              <input
                id="logradouro"
                required
                type="text"
                placeholder="Ex: Rua das Flores, 123"
                value={formData.endereco.logradouro}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    endereco: {
                      ...formData.endereco,
                      logradouro: e.target.value,
                    },
                  })
                }
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm transition-colors focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <label
                htmlFor="bairro"
                className="text-sm font-medium text-slate-700"
              >
                Bairro
              </label>
              <input
                id="bairro"
                required
                type="text"
                value={formData.endereco.bairro}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    endereco: { ...formData.endereco, bairro: e.target.value },
                  })
                }
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm transition-colors focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="localidade"
                className="text-sm font-medium text-slate-700"
              >
                Cidade
              </label>
              <input
                id="localidade"
                required
                type="text"
                value={formData.endereco.localidade}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    endereco: {
                      ...formData.endereco,
                      localidade: e.target.value,
                    },
                  })
                }
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm transition-colors focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="uf"
                className="text-sm font-medium text-slate-700"
              >
                UF
              </label>
              <input
                id="uf"
                required
                type="text"
                maxLength={2}
                placeholder="PR"
                value={formData.endereco.uf}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    endereco: {
                      ...formData.endereco,
                      uf: e.target.value.toUpperCase(),
                    },
                  })
                }
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm uppercase transition-colors focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
            </div>
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
          disabled={loading || buscandoCep}
          className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:outline-none disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : passageiroEditando ? (
            "Salvar Alterações"
          ) : (
            "Cadastrar Passageiro"
          )}
        </button>
      </div>
    </form>
  )
}
