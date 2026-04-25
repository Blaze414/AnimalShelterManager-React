import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Animals from "@/pages/Animals";
import AnimalDetails from "@/pages/AnimalDetails";
import AddAnimal from "@/pages/AddAnimal";
import Medical from "@/pages/Medical";
import Financial from "@/pages/Financial";
import Reports from "@/pages/Reports";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/animals" element={<Animals />} />
            <Route path="/animals/add" element={<AddAnimal />} />
            <Route path="/animals/:id/edit" element={<AddAnimal />} />
            <Route path="/animals/:id" element={<AnimalDetails />} />
            <Route path="/medical" element={<Medical />} />
            <Route path="/financial" element={<Financial />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
