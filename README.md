# Ecoa+

> Mais acesso, mais voz, mais cidadania.

Projeto da Global Solution 2026/2 (CitizenTech) da FIAP, desenvolvido pela equipe Inova Lab, turma 1TDSR.

## Objetivo

O Ecoa+ torna o atendimento em serviços públicos acessível para pessoas surdas e com deficiência auditiva, do começo ao fim: entender o serviço, agendar, esperar a vez e conversar com o atendente.

## O problema

O atendimento público ainda depende de ouvir:

- o agendamento costuma ser feito por telefone;
- na sala de espera, o nome é chamado em voz alta;
- no balcão, o atendente fala atrás de um vidro ou de máscara, o que impede a leitura labial;
- as informações vêm em português difícil, que nem sempre é a primeira língua de quem usa Libras.

Com isso, a pessoa perde a vez, depende de alguém para acompanhá-la ou desiste do serviço.

## Público

- Pessoas surdas que se comunicam em Libras.
- Pessoas com deficiência auditiva que usam aparelho auditivo e fazem leitura labial.
- Pessoas que perderam a audição com a idade.

O projeto também prevê, no roadmap, a ampliação para pessoas com deficiência motora (fase 2) e para pessoas cegas, não alfabetizadas e em situação de vulnerabilidade (fase 3).

## Funcionalidades

- Entender o serviço: tradução para Libras com o VLibras e textos em português simples, com checklist dos documentos que precisam ser levados.
- Agendar sem telefonar: escolha do serviço, da unidade, do dia e do horário pelo site.
- Ser avisado na hora: na página de acompanhamento, a tela pisca, o celular vibra e o título da aba muda quando o atendente chama.
- Conversar no balcão: a fala do atendente aparece em legenda ao vivo, em letras grandes.
- Acessibilidade: aumento da letra, alto contraste, leitura da página em voz alta, navegação por teclado e textos para leitores de tela.

## Tecnologias

| Tecnologia | Uso no projeto |
| --- | --- |
| React 19 + Vite | Base da aplicação (SPA) |
| TypeScript | Tipagem dos dados e dos componentes |
| Tailwind CSS 4 | Estilo e layout responsivo |
| React Router 7 | Rotas estáticas e rotas com parâmetro |
| Fetch API | Comunicação com a API Java (sem bibliotecas externas) |
| Web Speech API | Legenda ao vivo e leitura em voz alta |
| Vibration API | Aviso por vibração no celular |
| VLibras | Tradução de português para Libras (governo federal) |
| Vercel | Publicação do front-end |

## Estrutura do projeto

    src/
    ├── components/   # Partes reutilizáveis: cabeçalho, rodapé, botões, cartões e avisos
    ├── data/         # Conteúdo fixo: integrantes, FAQ e ícones
    ├── hooks/        # Lógica reutilizável: leitura em voz alta e reconhecimento de fala
    ├── pages/        # Uma página para cada rota
    ├── services/     # Chamadas à API Java com fetch
    ├── types/        # Tipos TypeScript dos dados da API
    ├── utils/        # Funções de apoio: datas e atalhos
    ├── App.tsx       # Definição das rotas
    ├── main.tsx      # Ponto de entrada da aplicação
    └── index.css     # Tema do Tailwind, cores e animações
    public/           # Favicon e fotos das integrantes

## Rotas

| Rota | Página |
| --- | --- |
| / | Início |
| /solucao | Como a solução funciona |
| /servicos | Lista de serviços com filtro por categoria |
| /servicos/:id | Detalhe do serviço e documentos necessários |
| /agendar/:servicoId | Formulário de agendamento |
| /atendimento/:id | Acompanhamento e aviso de "Chegou a sua vez!" |
| /balcao | Painel do atendente com legenda ao vivo |
| /sobre | Sobre o projeto |
| /integrantes | Equipe |
| /faq | Perguntas frequentes |
| /contato | Formulário de contato |

## Integrantes

| Nome | RM | Função | GitHub |
| --- | --- | --- | --- |
| Bianca Pereira da Silva | RM571077 | Back-end Java | [biancapereirasilva](https://github.com/biancapereirasilva) |
| Isabelle Souza Lima Pires Araujo | RM569370 | Banco de dados e IA | [isasouzz](https://github.com/isasouzz) |
| Maria Eduarda Cavallari Quarelo | RM570462 | Python e Software Engineering | [dudaquarelo](https://github.com/dudaquarelo) |
| Thays Lira de Oliveira | RM568799 | Front-end | [thaylira2026-hub](https://github.com/thaylira2026-hub) |

## Como executar

Pré-requisito: [Node.js](https://nodejs.org) 20 ou mais recente.

    # 1. Clonar o repositório
    git clone https://github.com/thaylira2026-hub/projeto-ecoa-global-solution.git
    cd projeto-ecoa-global-solution

    # 2. Instalar as dependências
    npm install

    # 3. Configurar a URL da API Java
    cp .env.example .env
    # abra o arquivo .env e preencha VITE_API_URL com a URL da API

    # 4. Rodar em modo de desenvolvimento
    npm run dev

O site abre em http://localhost:5173.

Para gerar a versão de produção: npm run build.

## Links

| | |
| --- | --- |
| Site publicado (Vercel) | https://projeto-ecoa-global-solution.vercel.app |
| Repositório (GitHub) | https://github.com/thaylira2026-hub/projeto-ecoa-global-solution |
| API Java | https://ecoamais-api.onrender.com | |
| Vídeo (YouTube) | a preencher com o link do vídeo |

## Uso de inteligência artificial

A equipe usou o Claude (Anthropic) como apoio no front-end: para gerar e revisar partes do código, explicar conceitos, encontrar erros e sugerir melhorias de acessibilidade. O código sugerido foi revisado, testado nas três resoluções e ajustado pela equipe antes de entrar no projeto.

## Contato

- E-mail: ecoa.inovalab@gmail.com
- Formulário: página [Contato](https://projeto-ecoa-global-solution.vercel.app/contato) do site

---

Feito pela equipe Inova Lab · FIAP · Global Solution 2026/2