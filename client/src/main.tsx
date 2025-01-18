//client\src\main.tsx
import "./i18n/config";
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./global.css";
import "./customize.scss";
import AppRoutes from "./AppRoutes";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./context/ThemeContext";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import { LanguageProvider } from "./contexts/LanguageContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false
    }
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense fallback="Loading...">
      <Router>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <PrimeReactProvider>
              <LanguageProvider>
                <AuthProvider>
                  <AppRoutes />
                  <Toaster />
                  <ReactQueryDevtools />
                </AuthProvider>
              </LanguageProvider>
            </PrimeReactProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </Router>
    </Suspense>
  </React.StrictMode>
);

