import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, Loader2, UserX } from "lucide-react"
import { toast } from "sonner" // Adicionado para manter o padrão de feedback
import { passageiroService } from "../services/passageiroService"
import { Button } from "../components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import { PassageiroFormModal } from "./components/PassageiroFormModal"

export function PassageirosPage() {
  const [passageiros, setPassageiros] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [passageiroEditando, setPassageiroEditando] = useState<any | null>(null)

  // NOVO ESTADO: Guarda o ID do passageiro que está sendo deletado
  const [deletandoId, setDeletandoId] = useState<string | null>(null)

  useEffect(() => {
    carregarPassageiros()
  }, [])

  const carregarPassageiros = async () => {
    setLoading(true)
    try {
      const data = await passageiroService.listar()
      setPassageiros(data || [])
    } catch (error) {
      console.error(error)
      setPassageiros([])
    } finally {
      setLoading(false)
    }
  }

  // ATUALIZADO: Agora controla o estado de loading e exibe notificações
  const handleDelete = async (id: string) => {
    if (window.confirm("Deseja mesmo remover este passageiro do sistema?")) {
      setDeletandoId(id) // Inicia o loading apenas para este ID
      try {
        await passageiroService.remover(id)
        toast.success("Passageiro removido com sucesso!")
        await carregarPassageiros() // Aguarda recarregar a lista
      } catch (error) {
        console.error("Erro ao deletar passageiro:", error)
        toast.error("Erro ao remover o passageiro.")
      } finally {
        setDeletandoId(null) // Finaliza o loading, independentemente do resultado
      }
    }
  }

  return (
    <div className="animate-in space-y-6 duration-500 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
            Passageiros
          </h3>
          <p className="text-sm text-slate-500">
            Gestão de clientes e histórico de contatos.
          </p>
        </div>
        <Button
          onClick={() => {
            setPassageiroEditando(null)
            setIsModalOpen(true)
          }}
          className="bg-slate-900 text-white"
        >
          <Plus size={16} className="mr-2" /> Novo Passageiro
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
                <TableHead>Nome</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {passageiros.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-32 text-center text-slate-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <UserX className="mb-3 h-8 w-8 opacity-20" />
                      <p>Nenhum passageiro cadastrado.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                passageiros.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium text-slate-900">
                      {p.nome}
                    </TableCell>
                    <TableCell className="text-slate-600">{p.cpf}</TableCell>
                    <TableCell className="text-slate-600">
                      <div className="flex flex-col">
                        <span>{p.email}</span>
                        <span className="text-xs text-slate-400">
                          {p.telefone}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setPassageiroEditando(p)
                          setIsModalOpen(true)
                        }}
                        disabled={deletandoId === p.id} // Impede edição enquanto deleta
                      >
                        <Pencil size={16} />
                      </Button>

                      {/* BOTÃO DE DELETAR ATUALIZADO */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(p.id)}
                        className="text-red-500"
                        disabled={deletandoId === p.id} // Desabilita o botão enquanto deleta
                      >
                        {/* Renderiza o spinner se for o ID atual, senão renderiza a lixeira */}
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

      <PassageiroFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false)
          carregarPassageiros()
        }}
        passageiroEditando={passageiroEditando}
      />
    </div>
  )
}
