import TituloPagina from '../components/TituloPagina'
import { perguntasFaq } from '../data/faq'

export default function Faq() {
  return (
    <section>
      <TituloPagina titulo="Perguntas frequentes" />
      <div className="space-y-3">
        {perguntasFaq.map((item) => (
          <details key={item.pergunta} className="rounded-2xl bg-white p-5 shadow">
            <summary className="cursor-pointer text-lg font-bold">{item.pergunta}</summary>
            <p className="mt-3 text-lg text-slate-700">{item.resposta}</p>
          </details>
        ))}
      </div>
    </section>
  )
}