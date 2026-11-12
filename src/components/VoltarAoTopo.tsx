import { useEffect, useState } from 'react'

export default function VoltarAoTopo() {
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    function verificarRolagem() {
      setVisivel(window.scrollY > 400)
    }
    window.addEventListener('scroll', verificarRolagem)
    return () => window.removeEventListener('scroll', verificarRolagem)
  }, [])

  function voltar() {
    const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduzirMovimento ? 'auto' : 'smooth' })
  }

  if (!visivel) {
    return null
  }

  return (
    <button
      type="button"
      onClick={voltar}
      aria-label="Voltar ao topo da página"
      className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-mare text-2xl text-white shadow-lg hover:bg-sinal hover:text-tinta"
    >
      <span aria-hidden="true">↑</span>
    </button>
  )
}