import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-slate-900 py-8 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 text-center md:flex-row md:items-center md:justify-between md:text-left">
        <div>
          <p className="text-lg font-bold">Ecoa+ · Inova Lab</p>
          <p className="text-slate-300">Mais acesso, mais voz, mais cidadania.</p>
        </div>
        <nav aria-label="Links do rodapé">
          <ul className="flex flex-wrap justify-center gap-4 md:justify-end">
            <li>
              <Link to="/faq" className="underline hover:text-blue-300">FAQ</Link>
            </li>
            <li>
              <Link to="/contato" className="underline hover:text-blue-300">Contato</Link>
            </li>
            <li>
              <Link to="/integrantes" className="underline hover:text-blue-300">Integrantes</Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}