import './App.css';
import Pages from "@/pages/index";
import { Toaster } from "@/components/ui/toaster";
import { HUDProvider } from "@/components/ObservabilityHUD/store";

function App() {
  return (
    <HUDProvider>
      <Pages />
      <Toaster />
    </HUDProvider>
  );
}

export default App;
