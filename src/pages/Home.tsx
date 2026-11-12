import BotaoLink from '../components/BotaoLink'
import Cartao from '../components/Cartao'

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="rounded-3xl bg-blue-700 px-6 py-12 text-white md:px-12">
        <p className="text-lg font-semibold text-blue-100">Inova Lab apresenta</p>
        <h1 className="mt-2 text-4xl font-bold md:text-5xl">Ecoa+</h1>
        <p className="mt-4 max-w-2xl text-xl">
          Serviços públicos acessíveis para pessoas surdas e com deficiência auditiva.
        </p>
        <p className="mt-2 text-xl font-semibold">Mais acesso, mais voz, mais cidadania.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <BotaoLink to="/servicos" variante="claro">
            Ver serviços
          </BotaoLink>
          <BotaoLink to="/solucao" variante="contorno">
            Como funciona
          </BotaoLink>
        </div>
      </section>

      <section aria-labelledby="titulo-recursos">
        <h2 id="titulo-recursos" className="text-2xl font-bold">
          O que você pode fazer
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Cartao titulo="Entender o serviço" icone="📄">
            <p>Veja o passo a passo em Libras ou em texto simples.</p>
          </Cartao>
          <Cartao titulo="Agendar sem ligar" icone="📅">
            <p>Marque seu atendimento pelo site, sem precisar de telefone.</p>
          </Cartao>
          <Cartao titulo="Não perder a vez" icone="📳">
            <p>Seu celular vibra e a tela pisca quando chamarem você.</p>
          </Cartao>
        </div>
      </section>
    </div>
  )
}