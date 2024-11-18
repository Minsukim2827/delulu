import './styles/App.css'
import Home from './components/Home/Home'
import { ThemeProvider } from './components/theme-provider'
import Header from './components/ui/header'

function App() {


  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen flex flex-col max-w-screen-xl mx-auto">
        <Header />
        <div className="flex-1 flex items-center">
            <Home />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
