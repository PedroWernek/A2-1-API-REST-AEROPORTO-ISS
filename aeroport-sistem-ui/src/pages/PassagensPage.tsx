import { useEffect, useState } from "react"
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Ticket as TicketIcon,
} from "lucide-react"
import { toast } from "sonner" // <-- Importação do feedback visual
import { passagemService } from "../services/passagemService"
import { Button } from "../components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import { PassagemFormModal } from "./components/PassagemFormModal"

// Função para formatar a data do voo de forma legível
const formatarDataVisivel = (dataJava: string) => {
  if (!dataJava) return ""
  const limpa = dataJava.replace("T", " ")
  const partes = limpa.split(" ")
  if (partes.length !== 2) return limpa

  const [ano, mes, dia] = partes[0].split("-")
  const hora = partes[1].substring(0, 5)
  return `${dia}/${mes}/${ano} às ${hora}`
}

export function PassagensPage() {
  const [passagens, setPassagens] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [passagemEditando, setPassagemEditando] = useState<any | null>(null)

  // NOVO ESTADO: Guarda o ID da passagem que está sendo deletada
  const [deletandoId, setDeletandoId] = useState<string | null>(null)

  useEffect(() => {
    carregarPassagens()
  }, [])

  const carregarPassagens = async () => {
    setLoading(true)
    try {
      const data = await passagemService.listar()
      setPassagens(data || [])
    } catch (error) {
      console.error(error)
      toast.error("Erro ao carregar a lista de passagens do servidor.") // <-- Feedback visual de erro na listagem
      setPassagens([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "Atenção: Tem a certeza que deseja cancelar e eliminar esta passagem?"
      )
    ) {
      setDeletandoId(id) // Ativa o loading apenas nesta linha específica
      try {
        await passagemService.remover(id)
        toast.success("Passagem eliminada com sucesso!") // <-- Feedback visual de sucesso
        await carregarPassagens() // Aguarda a tabela recarregar
      } catch (error) {
        console.error(error)
        toast.error("Erro ao eliminar a passagem. Tente novamente.") // <-- Feedback visual de erro
      } finally {
        setDeletandoId(null) // Desativa o loading, independentemente do sucesso ou erro
      }
    }
  }

  return (
    <div className="animate-in space-y-6 duration-500 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
            Passagens
          </h3>
          <p className="text-sm text-slate-500">
            Emissão de bilhetes e controlo de assentos.
          </p>
        </div>
        <Button
          onClick={() => {
            setPassagemEditando(null)
            setIsModalOpen(true)
          }}
          className="bg-slate-900 text-white hover:bg-slate-800"
        >
          <Plus size={16} className="mr-2" /> Emitir Passagem
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
                <TableHead>Passageiro</TableHead>
                <TableHead>Voo (Rota e Data)</TableHead>
                <TableHead>Assento</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {passagens.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-slate-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <TicketIcon className="mb-3 h-8 w-8 opacity-20" />
                      <p>Nenhuma passagem emitida.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                passagens.map((p) => (
                  <TableRow
                    key={p.id}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <TableCell className="font-medium text-slate-900">
                      {p.passageiro?.nome || "N/A"}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800">
                          {p.voo?.origem} → {p.voo?.destino}
                        </span>
                        <span className="text-xs text-slate-500">
                          {p.voo?.dataHoraVoo
                            ? formatarDataVisivel(p.voo.dataHoraVoo)
                            : "Sem data"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-500/10 ring-inset">
                        {p.assento}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-slate-600">
                      R$ {Number(p.valor).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-500 hover:text-slate-900"
                        onClick={() => {
                          setPassagemEditando(p)
                          setIsModalOpen(true)
                        }}
                        disabled={deletandoId === p.id} // Bloqueia durante exclusão
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(p.id)}
                        className="text-slate-400 hover:bg-red-50 hover:text-red-600"
                        disabled={deletandoId === p.id} // Bloqueia durante exclusão
                      >
                        {/* Renderiza o spinner se estiver deletando, senão a lixeira */}
                        {deletandoId === p.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <PassagemFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false)
          carregarPassagens()
        }}
        passagemEditando={passagemEditando}
      />
    </div>
  )
}
