import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import AuthProvider from './providers/AuthProvider'
import Routes from './Routes'
import { theme } from './theme'
import { AnimatePresence } from 'framer-motion'


function App() {


  return (
    <AnimatePresence mode="wait">
      <AuthProvider>
        <ChakraProvider theme={theme} toastOptions={{ defaultOptions: { position: "top-right" } }}>
          <ColorModeScript initialColorMode="light" />
          <Routes />
        </ChakraProvider>
      </AuthProvider>
    </AnimatePresence>

  )
}

export default App
