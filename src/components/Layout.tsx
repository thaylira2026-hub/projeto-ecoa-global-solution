import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import VoltarAoTopo from './VoltarAoTopo'

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-nevoa text-tinta">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-20 focus:rounded-lg focus:bg-sinal focus:p-3 focus:font-semibold"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" className="mx-auto w-full max-w-7xl flex-1 px-4 py-10">
        <Outlet />
      </main>
      <Footer />
      <VoltarAoTopo />
    </div>
  )
}