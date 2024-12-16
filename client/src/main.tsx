//client\src\main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './global.css'
import AppRoutes from './AppRoutes'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from './components/ui/toaster'
import { ThemeProvider } from './context/ThemeContext'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchIntervalInBackground: false,
            refetchOnWindowFocus: false,
        },
    },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Router>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
                    <AuthProvider>
                        <AppRoutes />
                        <Toaster />
                        <ReactQueryDevtools />
                    </AuthProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </Router>
    </React.StrictMode>
)