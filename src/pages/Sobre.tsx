import Cartao from '../components/Cartao'
import TituloPagina from '../components/TituloPagina'

export default function Sobre() {
  return (
    <div className="space-y-16">
      <TituloPagina
        etiqueta="Quem somos"
        icone="💬"
        titulo="Sobre o Ecoa+"
        descricao="O Ecoa+ nasceu na Inova Lab para que pessoas surdas e com deficiência auditiva sejam atendidas nos serviços públicos com autonomia, sem depender de terceiros."
      />

      <section aria-labelledby="titulo-essencia" className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 id="titulo-essencia" className="text-3xl font-extrabold tracking-tight">
            Nossa essência
          </h2>
          <p className="mt-4 text-2xl font-semibold leading-snug text-mare">
            Inclusão não é sobre se adaptar ao mundo. É sobre construir um mundo que considere todas
            as pessoas.
          </p>
        </div>
        <p className="text-lg leading-relaxed text-tinta/80">
          Cada pessoa tem uma história, uma maneira de se comunicar, aprender, trabalhar e viver. O
          Ecoa+ acredita que essas diferenças devem ser respeitadas e valorizadas. Por isso, o site
          oferece mais de um caminho: Libras, português simples, legenda e avisos visuais. A pessoa
          escolhe o que funciona para ela.
        </p>
      </section>

      <section aria-labelledby="titulo-problema">
        <h2 id="titulo-problema" className="text-3xl font-extrabold tracking-tight">
          O problema
        </h2>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-tinta/80">
          Milhões de brasileiros têm alguma deficiência auditiva. No posto de saúde, no Poupatempo
          ou no CRAS, quase tudo depende de ouvir: o agendamento por telefone, a chamada pelo nome
          na fila e a explicação do atendente no balcão. Para muitos surdos, a Libras é a primeira
          língua e o português escrito é a segunda, então só texto também não resolve.
        </p>
      </section>

      <section aria-labelledby="titulo-publico">
        <h2 id="titulo-publico" className="text-3xl font-extrabold tracking-tight">
          Para quem é
        </h2>
        <p className="mt-3 max-w-3xl text-lg text-tinta/80">
          Pessoas com deficiência auditiva têm experiências diferentes: nem todas usam Libras.
          Algumas se comunicam pela fala, pela leitura labial, por texto ou por uma combinação de
          tudo isso.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Cartao titulo="Pessoas surdas" icone="🤟">
            <p>Que se comunicam em Libras.</p>
          </Cartao>
          <Cartao titulo="Deficiência auditiva" icone="👂">
            <p>Pessoas que se comunicam em português, com ou sem aparelho auditivo, muitas vezes pela leitura labial.</p>
          </Cartao>
          <Cartao titulo="Perda auditiva com a idade" icone="👵">
            <p>Idosos que passaram a ouvir menos ao longo da vida.</p>
          </Cartao>
        </div>
      </section>

      <section className="rounded-3xl bg-tinta px-8 py-12 text-nevoa md:px-14">
        <p className="max-w-4xl text-2xl font-semibold leading-snug md:text-3xl">
          A inclusão não deve ser um favor oferecido a alguém. Deve ser uma condição para que todas
          as pessoas possam participar.
        </p>
      </section>

      <section aria-labelledby="titulo-ods">
        <h2 id="titulo-ods" className="text-3xl font-extrabold tracking-tight">
          Objetivos de Desenvolvimento Sustentável (ONU)
        </h2>
        <ul className="mt-4 space-y-3 text-lg">
          <li>
            <span className="font-bold">ODS 10, Redução das desigualdades:</span> acesso igual aos
            serviços públicos.
          </li>
          <li>
            <span className="font-bold">ODS 3, Saúde e bem-estar:</span> agendamento e atendimento
            em saúde sem barreiras.
          </li>
          <li>
            <span className="font-bold">ODS 11, Cidades e comunidades sustentáveis:</span> serviços
            públicos inclusivos.
          </li>
        </ul>
      </section>

      <section aria-labelledby="titulo-escuta" className="rounded-3xl border border-tinta/10 bg-white p-8 md:p-10">
        <h2 id="titulo-escuta" className="text-3xl font-extrabold tracking-tight">
          Feito com quem vive o problema
        </h2>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-tinta/80">
          Os textos e a experiência do site foram revisados com a colaboração da Fran, que tem
          deficiência auditiva, usa aparelho auditivo e se comunica pela leitura labial. As sugestões
          dela ajudaram a deixar a linguagem mais clara e acolhedora.
        </p>
        <p className="mt-6 text-xl font-semibold text-mare">
          Ecoa+. Inclusão que se transforma em atitude.
        </p>
      </section>
    </div>
  )
}