// src/main.tsx

import './index.css';
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AuthProvider } from './auth/AuthContext'
import { ToastProvider } from './components/Toast'

import App from './App'
import { store } from './app/store'

// ✅ Create a QueryClient instance (React Query brain)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ✅ Avoid refetching constantly while you're building
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* ✅ Redux store provider */}
    <Provider store={store}>
      <AuthProvider>
        <ToastProvider>
        {/* ✅ Router provider */}
        <BrowserRouter>
          {/* ✅ React Query provider */}
          <QueryClientProvider client={queryClient}>
            <App />
            {/* ✅ Devtools are super helpful while learning */}
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </Provider>
  </React.StrictMode>
)
