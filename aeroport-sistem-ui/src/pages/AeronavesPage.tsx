import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, Loader2, PlaneTakeoff } from "lucide-react"
import { aeronaveService, Aeronave } from "../services/aeronaveService"
import { Button } from "../components/ui/button"
import { AeronaveFormModal } from "./components/AeronaveFormModal"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import { toast } from "sonner"

export function AeronavesPage() {
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([])
  const [loading, setLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [aeronaveEditando, setAeronaveEditando] = useState<Aeronave | null>(
    null
  )

  useEffect(() => {
    carregarAeronaves()
  }, [])

  const carregarAeronaves = async () => {
    setLoading(true)
    try {
      const data = await aeronaveService.listar()
      setAeronaves(data)
    } catch (error) {
      console.error("Erro ao carregar aeronaves:", error)
    } finally {
      setLoading(false)
    }
  }

const handleDelete = async (id?: string) => {
  if (!id) return // <-- Se não tiver ID, cancela a função na hora

  if (window.confirm("Tem a certeza que deseja eliminar esta aeronave?")) {
    try {
      await aeronaveService.remover(id)
      toast.success("Aeronave removida permanentemente.")
      carregarAeronaves()
    } catch (error) {
      console.error(error)
      toast.error(
        "Não foi possível remover a aeronave. Verifique se existem voos associados a ela."
      )
    }
  }
}

  return (
    <div className="animate-in space-y-6 duration-500 fade-in">
      {/* Cabeçalho da Página */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
            Aeronaves
          </h3>
          <p className="text-sm text-slate-500">
            Gerencie a frota de aeronaves do aeroporto.
          </p>
        </div>
        <Button
          onClick={() => {
            setAeronaveEditando(null)
            setIsModalOpen(true)
          }}
          className="..."
        >
          <Plus size={16} />
          Nova Aeronave
        </Button>
      </div>

      {/* Tabela ou Estado de Carregamento */}
      {loading ? (
        <div className="flex h-[400px] w-full items-center justify-center rounded-md border border-dashed border-slate-200 bg-white/50">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow>
                <TableHead className="font-semibold text-slate-900">
                  Modelo
                </TableHead>
                <TableHead className="font-semibold text-slate-900">
                  Tipo
                </TableHead>
                <TableHead className="font-semibold text-slate-900">
                  Capacidade
                </TableHead>
                <TableHead className="text-right font-semibold text-slate-900">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aeronaves.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <PlaneTakeoff className="mb-3 h-8 w-8 opacity-20" />
                      <p>Nenhuma aeronave cadastrada.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                aeronaves.map((aeronave) => (
                  <TableRow
                    key={aeronave.id}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <TableCell className="font-medium text-slate-900">
                      {aeronave.modelo}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {aeronave.tipo}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {aeronave.capacidadeAssentos} assentos
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setAeronaveEditando(aeronave)
                            setIsModalOpen(true)
                          }}
                          className="..."
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:bg-red-50 hover:text-red-600"
                          onClick={() => handleDelete(aeronave.id)}
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
      <AeronaveFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false)
          carregarAeronaves() // Recarrega os dados da API
        }}
        aeronaveEditando={aeronaveEditando}
      />
    </div>
  )
}
