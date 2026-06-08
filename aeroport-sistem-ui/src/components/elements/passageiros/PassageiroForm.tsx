import { useState, useEffect } from "react"
import {
  passageiroService,
  Passageiro,
} from "../../../services/passageiroService"

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
    endereco: {
      cep: "",
      logradouro: "",
      bairro: "",
      localidade: "",
      uf: "",
    },
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (passageiroEditando) {
      setFormData({
        nome: passageiroEditando.nome || "",
        cpf: passageiroEditando.cpf || "",
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (passageiroEditando?.id) {
        await passageiroService.atualizar(passageiroEditando.id, formData)
      } else {
        await passageiroService.criar(formData)
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
            Nome Completo
          </label>
          <input
            required
            type="text"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            CPF
          </label>
          <input
            required
            type="text"
            value={formData.cpf}
            onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
          />
        </div>
      </div>

      <div className="pt-2">
        <h4 className="mb-2 text-sm font-semibold tracking-wider text-slate-500 uppercase">
          Endereço
        </h4>
        <div className="mb-4 grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              CEP
            </label>
            <input
              required
              type="text"
              value={formData.endereco.cep}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  endereco: { ...formData.endereco, cep: e.target.value },
                })
              }
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
          <div className="col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Logradouro
            </label>
            <input
              required
              type="text"
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
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Bairro
            </label>
            <input
              required
              type="text"
              value={formData.endereco.bairro}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  endereco: { ...formData.endereco, bairro: e.target.value },
                })
              }
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Cidade
            </label>
            <input
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
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              UF
            </label>
            <input
              required
              type="text"
              maxLength={2}
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
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm uppercase focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {loading
            ? "A Guardar..."
            : passageiroEditando
              ? "Atualizar"
              : "Guardar"}
        </button>
      </div>
    </form>
  )
}
