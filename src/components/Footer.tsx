import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-tinta py-10 text-nevoa">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-2xl font-extrabold">Ecoa+</p>
          <p className="mt-1 text-nevoa/80">Mais acesso, mais voz, mais cidadania.</p>
          <p className="mt-1 text-sm text-nevoa/60">Um projeto da Inova Lab.</p>
        </div>
        <nav aria-label="Links do rodapé">
          <ul className="flex flex-wrap gap-5">
            <li>
              <Link to="/faq" className="underline underline-offset-4 hover:text-sinal">FAQ</Link>
            </li>
            <li>
              <Link to="/contato" className="underline underline-offset-4 hover:text-sinal">Contato</Link>
            </li>
            <li>
              <Link to="/integrantes" className="underline underline-offset-4 hover:text-sinal">Integrantes</Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}