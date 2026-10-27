# Portfólio — Gabriel Goris

Portfólio com cara de PC antigo: área de trabalho, janelas arrastáveis, barra de tarefas, menu Iniciar, tela de boot e uma cena 3D (React Three Fiber) dentro do `NewCAD.exe`.

## Rodando

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/
npm run preview  # serve o build
```

## Onde mexer

| O quê | Arquivo |
| --- | --- |
| E-mail, LinkedIn, GitHub, links do Horizon, caminho do currículo | `src/data/profile.ts` |
| Currículo em PDF | coloque em `public/curriculo.pdf` |
| Todos os textos (PT e EN) | `src/i18n/strings.ts` |
| Cores, fonte e bordas chanfradas | `src/index.css` (`@theme` + `@utility bevel`) |
| Janelas (conteúdo de cada uma) | `src/windows/*.tsx` |
| Registro das janelas (largura, ordem) | `src/components/Desktop.tsx` + `WINDOW_IDS` em `src/hooks/useWindowManager.ts` |
| Layout da cozinha 3D | `src/three/modules.ts` |
| Linha do tempo (experiencia.log) e itens da Lixeira | `src/i18n/strings.ts` (`experience` e `trash`) |
| Comandos do terminal | `src/windows/Terminal.tsx` |

### Adicionando uma janela nova

1. Adicione o id em `WINDOW_IDS` (`src/hooks/useWindowManager.ts`).
2. Adicione o ícone em `src/components/Icons.tsx`.
3. Adicione os textos em `files` nas duas línguas (`src/i18n/strings.ts`).
4. Crie o componente em `src/windows/` e registre em `WINDOWS` (`src/components/Desktop.tsx`).

## Notas

- O Three.js (~250 kB gzip) só é baixado quando a janela do NewCAD abre (`React.lazy`).
- A cena usa `frameloop="demand"`: só renderiza quando algo muda.
- Idioma: detecta o navegador e lembra a escolha (botão PT/EN na barra de tarefas).
- Em telas ≤ 720px as janelas abrem em tela cheia.
- `prefers-reduced-motion` pula o boot e desliga o cursor piscando.
- Ícones da área de trabalho: arraste para reposicionar (encaixa na grade, posição salva no navegador); botão direito no fundo → "Organizar ícones" volta ao padrão.
- snake.exe: setas/WASD (ou deslizar/D-pad no celular); pausa sozinho quando a janela perde o foco; o recorde fica salvo no navegador.
