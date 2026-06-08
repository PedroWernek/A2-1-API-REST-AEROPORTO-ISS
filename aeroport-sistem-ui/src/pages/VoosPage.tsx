import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, Loader2, Plane } from "lucide-react"
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
      setVoos(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Deseja mesmo cancelar e remover este voo?")) {
      await vooService.remover(id)
      carregarVoos()
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
          className="bg-slate-900 text-white"
        >
          <Plus size={16} className="mr-2" /> Novo Voo
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
                <TableHead>Voo</TableHead>
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
                    Nenhum voo programado.
                  </TableCell>
                </TableRow>
              ) : (
                voos.map((voo) => (
                  <TableRow key={voo.id}>
                    <TableCell className="font-medium text-slate-900">
                      {voo.numero}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 font-medium text-slate-600">
                        {voo.origem}{" "}
                        <Plane size={14} className="text-slate-400" />{" "}
                        {voo.destino}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {voo.aeronave?.modelo || "Não alocada"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
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
