import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { startReactDsfr } from '@codegouvfr/react-dsfr/spa'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'

// This is the lib and tools from the French State official lib
startReactDsfr({ defaultColorScheme: "system" })

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        {/*<WagmiProvider config={config}>*/}
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        {/*</WagmiProvider>*/}
    </StrictMode>,
)