type TituloPaginaProps = {
  titulo: string
  descricao?: string
}

export default function TituloPagina({ titulo, descricao }: TituloPaginaProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold md:text-4xl">{titulo}</h1>
      {descricao && <p className="mt-3 max-w-3xl text-lg text-slate-700">{descricao}</p>}
    </div>
  )
}