import { useEffect, useState } from "react"
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Ticket as TicketIcon,
} from "lucide-react"
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

export function PassagensPage() {
  const [passagens, setPassagens] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [passagemEditando, setPassagemEditando] = useState<any | null>(null)

  useEffect(() => {
    carregarPassagens()
  }, [])

  const carregarPassagens = async () => {
    setLoading(true)
    try {
      const data = await passagemService.listar()
      setPassagens(data)
    } catch (error) {
      console.error(error)
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
      await passagemService.remover(id)
      carregarPassagens()
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
          className="bg-slate-900 text-white"
        >
          <Plus size={16} className="mr-2" /> Emitir Passagem
        </Button>
      </div>

      {loading ? (
        <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
          <Loader2 className="animate-spin text-slate-400" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow>
                <TableHead>Passageiro</TableHead>
                <TableHead>Voo</TableHead>
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
                  <TableRow key={p.id}>
                    <TableCell className="font-medium text-slate-900">
                      {p.passageiro?.nome || "N/A"}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {p.voo?.numero}{" "}
                      <span className="text-xs text-slate-400">
                        ({p.voo?.origem}-{p.voo?.destino})
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-500/10 ring-inset">
                        {p.assento}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      R$ {Number(p.valor).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setPassagemEditando(p)
                          setIsModalOpen(true)
                        }}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(p.id)}
                        className="text-red-500"
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
