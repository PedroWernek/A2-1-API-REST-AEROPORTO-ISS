import { Plane, Calendar, Users, Ticket } from "lucide-react"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navItems = [
    { id: "voos", label: "Voos", icon: Calendar },
    { id: "passagens", label: "Passagens", icon: Ticket },
    { id: "passageiros", label: "Passageiros", icon: Users },
    { id: "aeronaves", label: "Aeronaves", icon: Plane },
  ]

  return (
    <aside className="fixed top-0 left-0 flex h-screen w-64 flex-col border-r border-slate-200 bg-slate-50">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          AeroCWB
        </h1>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-slate-200 text-slate-900"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
