import { useEffect, useState } from "react"
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Plane,
  CalendarClock,
} from "lucide-react"
import { toast } from "sonner" // <-- 1. Importamos o toast para os avisos visuais
import { vooService } from "../services/vooService"
import { Button } from "../components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import { VooFormModal } from "./components/VooFormModal"

// Função auxiliar para formatar a data que vem do Java na tabela
const formatarDataVisivel = (dataJava: string) => {
  if (!dataJava) return ""
  const limpa = dataJava.replace("T", " ")
  const partes = limpa.split(" ")
  if (partes.length !== 2) return limpa

  const [ano, mes, dia] = partes[0].split("-")
  const hora = partes[1].substring(0, 5)
  return `${dia}/${mes}/${ano} às ${hora}`
}

export function VoosPage() {
  const [voos, setVoos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [vooEditando, setVooEditando] = useState<any | null>(null)

  useEffect(() => {
    carregarVoos()
  }, [])

  const carregarVoos = async () => {
    setLoading(true)
    try {
      const data = await vooService.listar()
      setVoos(data || [])
    } catch (error) {
      console.error(error)
      toast.error("Erro ao carregar a lista de voos do servidor.") // <-- Aviso se a API falhar ao listar
      setVoos([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Deseja mesmo cancelar e remover este voo?")) {
      try {
        await vooService.remover(id)
        toast.success("Voo cancelado e removido com sucesso!") // <-- 2. Feedback visual de SUCESSO
        carregarVoos()
      } catch (error) {
        console.error(error)
        toast.error(
          "Erro ao remover o voo. Pode haver passagens emitidas para esta rota."
        ) // <-- 3. Feedback visual de ERRO
      }
    }
  }

  return (
    <div className="animate-in space-y-6 duration-500 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
            Voos
          </h3>
          <p className="text-sm text-slate-500">
            Gestão de rotas e alocação de aeronaves.
          </p>
        </div>
        <Button
          onClick={() => {
            setVooEditando(null)
            setIsModalOpen(true)
          }}
          className="bg-slate-900 text-white hover:bg-slate-800"
        >
          <Plus size={16} className="mr-2" /> Novo Voo
        </Button>
      </div>

      {loading ? (
        <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed border-slate-200">
          <Loader2 className="animate-spin text-slate-400" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow>
                <TableHead>Data e Hora</TableHead>{" "}
                {/* Corrigido: Voo não tem número, tem data */}
                <TableHead>Rota</TableHead>
                <TableHead>Aeronave</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {voos.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-32 text-center text-slate-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Plane className="mb-2 h-8 w-8 opacity-20" />
                      Nenhum voo programado.
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                voos.map((voo) => (
                  <TableRow
                    key={voo.id}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <TableCell className="font-medium text-slate-900">
                      <div className="flex items-center gap-2">
                        <CalendarClock size={16} className="text-slate-400" />
                        {formatarDataVisivel(voo.dataHoraVoo)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 font-medium text-slate-600">
                        <span className="rounded bg-blue-50 px-2 py-1 text-blue-700">
                          {voo.origem}
                        </span>
                        <Plane size={14} className="text-slate-400" />
                        <span className="rounded bg-red-50 px-2 py-1 text-red-700">
                          {voo.destino}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {voo.aeronave?.modelo
                        ? `${voo.aeronave.modelo} (${voo.assentosDisponiveis} lugares livres)`
                        : "Não alocada"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-500 hover:text-slate-900"
                        onClick={() => {
                          setVooEditando(voo)
                          setIsModalOpen(true)
                        }}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(voo.id)}
                        className="text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <VooFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false)
          carregarVoos()
        }}
        vooEditando={vooEditando}
      />
    </div>
  )
}
