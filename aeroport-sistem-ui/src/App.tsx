import { useState } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { VoosList } from "./components/voos/VoosList";
import { AeronavesList } from "./components/aeronaves/AeronavesList";
import { PassageirosList } from "./components/passageiros/PassageirosList";
import { PassagensList } from "./components/passagens/PassagensList";

function App() {
  const [activeTab, setActiveTab] = useState("voos");

  const renderContent = () => {
    switch (activeTab) {
      case "voos":
        return <VoosList />;
      case "aeronaves":
        return <AeronavesList />;
      case "passageiros":
        return <PassageirosList />;
      case "passagens":
        return <PassagensList />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="ml-64 flex-1 p-8">
        <header className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 capitalize">
            {activeTab}
          </h2>
        </header>
        
        {renderContent()}
      </main>
    </div>
  );
}

export default App;