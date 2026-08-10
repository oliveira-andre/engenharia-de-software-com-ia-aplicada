# Phase 0: Research

Pesquisa de decisões técnicas para a tela inicial do catálogo. Cada decisão é registrada no formato `Decisão / Racional / Alternativas` e referencia o requisito ou princípio que motivou a escolha.

## Stack de UI

**Decisão**: React 19 + Vite 6 + TypeScript 5.6.

**Racional**: React 19 traz `useTransition` e `<Suspense>` server-aware úteis para os estados de loading de cada região (FR-010), mesmo em uma SPA sem SSR. Vite 6 dá HMR sub segundo e tree-shaking agressivo, o que ajuda a manter o bundle inicial dentro do orçamento de 80KB gzipped (Princípio IV). TypeScript estrito protege contratos internos de componente, alinhado a Versionamento Semântico (Princípio III).

**Alternativas consideradas**:
- **Next.js 15 App Router**: rejeitado. Adiciona complexidade de roteamento e build server-side que não traz valor para uma SPA sem backend. Aumenta footprint de runtime sem ganho mensurável em **LCP** para o caso plano (uma única rota). O README cita Next.js como hipótese inicial, mas o plano formal pode divergir desde que justificado (e foi).
- **Solid + Vite**: rejeitado. Equipe e ecossistema de tooling de acessibilidade (axe-core, RTL) mais maduros em React. YAGNI sobre adotar framework novo sem requisito que justifique.
- **Astro com ilhas React**: rejeitado. Não há conteúdo estático suficiente para justificar SSG. Adicionaria duas linguagens (Astro + React) na mesma camada de UI.

## Gerenciamento de estado

**Decisão**: React state local + custom hooks. Sem framework de estado global.

**Racional**: O estado da tela é particionado naturalmente por região (hero, três carrosséis, overlay). Não há leitor de estado fora desses limites. Adotar Redux, Zustand ou Jotai aqui é abstração antes da terceira ocorrência do padrão (Princípio II).

**Alternativas consideradas**:
- **Zustand**: rejeitado por YAGNI. Reavaliar se overlay precisar carregar dados próprios em feature posterior.
- **Context API global**: rejeitado. Re-renderizações desnecessárias e nenhum ganho frente a hooks isolados por região.

## Estilização

**Decisão**: CSS Modules nativos do Vite + arquivo de tokens em [src/styles/tokens.css].

**Racional**: CSS Modules têm zero runtime, geram apenas classes compiladas (sem custo em **INP**), e suportam variáveis CSS para tokens de design (cores, contraste, espaçamentos). Tokens centralizados garantem contraste WCAG AA verificável (Princípio V).

**Alternativas consideradas**:
- **Tailwind CSS**: rejeitado por YAGNI. Sem catálogo de classes utilitárias compartilhado entre múltiplas features ainda, não compensa o custo de aprendizado e o tamanho de CSS gerado.
- **CSS-in-JS (vanilla-extract, styled-components)**: rejeitado. Runtime extra ou complexidade de build que não traz ganho mensurável.
- **Inline styles**: rejeitado. Não suporta pseudo-classes (`:hover`, `:focus-visible`) necessárias para FR-007 e FR-009.

## Estratégia de dados mockados

**Decisão**: Função geradora pura em [src/services/catalogService.ts] que retorna `Promise<Category[]>`. Aceita configuração de latência (ms) por categoria e flag de erro por categoria.

**Racional**: Atende diretamente FR-018. Função pura é trivial de testar e permite reproduzir cada um dos 16 estados possíveis (4 estados × 4 regiões) de forma determinística (SC-005). Mantém superfície de mock interna ao projeto, sem servidor adicional.

**Alternativas consideradas**:
- **MSW (Mock Service Worker)**: rejeitado por YAGNI. Não há cliente HTTP nem fetch nesta entrega para interceptar. Adicionaria service worker apenas para mock.
- **Arquivo JSON estático em `/public`**: rejeitado. Não cobre cenário de erro nem de latência sem código adicional, o que duplicaria a lógica de mock.
- **JSON Server**: rejeitado. Servidor extra para rodar localmente, custo de orquestração que YAGNI.

## Imagens de poster

**Decisão**: Servir AVIF como formato primário com fallback WebP via `<picture>` e `srcset`. Lazy-load nativo (`loading="lazy"`) para tudo fora da viewport inicial. `fetchpriority="high"` apenas no destaque visível do hero.

**Racional**: AVIF reduz peso da imagem em 30-50% versus WebP em qualidade equivalente, impacto direto em **LCP** (Princípio IV). Lazy-load nativo evita biblioteca terceira (YAGNI). `fetchpriority` é a forma moderna recomendada pelos Core Web Vitals.

**Alternativas consideradas**:
- **Next/Image ou bibliotecas similares**: rejeitado por não usarmos Next, e por não justificar dependência adicional para um caso de uso plano.
- **Lazy-loading via IntersectionObserver custom**: rejeitado. `loading="lazy"` nativo cobre o caso com zero JS.

## Navegação por teclado

**Decisão**: Implementar via hook custom `useCarouselKeyboard` que escuta `keydown` no container do carrossel e move foco usando `element.focus()`. Foco gerenciado por `tabindex` dinâmico (roving tabindex pattern).

**Racional**: Roving tabindex é o padrão recomendado pela WAI-ARIA para listas horizontais navegáveis. Um único elemento por carrossel tem `tabindex=0`, os demais `tabindex=-1`. Tab move entre carrosséis, setas movem dentro do carrossel. Atende FR-008 (sem loop nas bordas) e SC-001 (dois segundos do topo até qualquer card).

**Alternativas consideradas**:
- **Todos cards com tabindex=0**: rejeitado. Quebra a expectativa de leitores de tela e força o usuário a passar por dezenas de elementos com Tab.
- **Biblioteca `react-aria` ou `@react-aria/listbox`**: rejeitado. Adiciona ~30KB ao bundle, supera o orçamento sem ganho frente ao hook custom.

## Live region do hero

**Decisão**: Componente `<HeroProgress>` contém um elemento `<div role="status" aria-live="polite" aria-atomic="true">` que recebe texto "Destaque {N} de {Total}" a cada transição.

**Racional**: Atende FR-019. `polite` evita interromper leitura em curso. `aria-atomic="true"` força leitura completa da mensagem (não só do delta), evitando que o leitor anuncie apenas o número.

**Alternativas consideradas**:
- **`aria-live="assertive"`**: rejeitado. Interrompe leitura, viola princípio de não roubar atenção desnecessariamente.
- **Anúncio via `aria-label` no slide ativo**: rejeitado. Leitor de tela só anunciaria ao receber foco no slide, não ao trocar automaticamente.

## Gestão de foco do overlay

**Decisão**: Hook `useFocusTrap` que ao montar do overlay (a) captura o elemento ativo no `document.activeElement`, (b) move foco para o primeiro elemento focável dentro do overlay, (c) intercepta Tab para circular foco dentro do overlay, (d) ao desmontar restaura foco no elemento originalmente ativo.

**Racional**: Atende FR-013 e FR-020. Comportamento canônico de modal WAI-ARIA. Hook isolado é testável e reutilizável.

**Alternativas consideradas**:
- **Bibliotecas (`focus-trap-react`, `react-focus-lock`)**: rejeitado. ~5KB cada, mas implementação custom em ~40 linhas com cobertura de teste cabe no princípio II.

## Suporte a prefers-reduced-motion

**Decisão**: Hook `usePrefersReducedMotion` que escuta `window.matchMedia('(prefers-reduced-motion: reduce)')`. Quando ativo: (a) rotação automática do hero é desabilitada (FR-012), (b) rolagem horizontal do carrossel via teclado é instantânea sem animação (FR-021), (c) transições de hover/foco do card são suprimidas via classe CSS condicional.

**Racional**: Cobre FR-012 e FR-021 com uma única fonte de verdade reativa.

**Alternativas consideradas**:
- **CSS `@media (prefers-reduced-motion)` isolado**: rejeitado. Não consegue desabilitar timers JavaScript da rotação automática (FR-012), só a parte visual.

## Testes

**Decisão**: Três camadas independentes.

| Camada | Ferramenta | Cobertura |
|--------|------------|-----------|
| Unitário | Vitest | `catalogService` (todas as combinações de latência/erro), hooks puros (`useHeroRotation`, `useFocusTrap`, `usePrefersReducedMotion`, `useCarouselKeyboard`). |
| Componente | Vitest + RTL + axe-core | Componentes com interação (Hero, Carousel, CarouselCard, OverlayHost, DataRegion). Cada teste roda `axe.run()` no DOM final e falha se houver violação AA. |
| E2E | Playwright | Fluxos cross-componente: navegação por teclado do topo até qualquer card (SC-001), medição de **INP** e **LCP** via Web Vitals API (SC-002, SC-003), comportamento sob `prefers-reduced-motion`. |

**Racional**: Pirâmide clássica. axe-core dentro do RTL atende SC-006 sem rodar Lighthouse a cada teste. Playwright cobre o que RTL não consegue (medição real de Web Vitals, navegador real).

**Alternativas consideradas**:
- **Cypress no lugar do Playwright**: rejeitado. Playwright tem melhor suporte a override de `prefers-reduced-motion` e medição de Web Vitals em paralelo nos três navegadores alvo.
- **Storybook + Chromatic**: rejeitado por YAGNI. Útil em projeto com biblioteca compartilhada de componentes, não nesta entrega.

## Medição de performance em CI

**Decisão**: Playwright captura **LCP** via PerformanceObserver e **INP** via Web Vitals library da equipe do Chrome, salvando JSON com resultados. CI marca o teste como falho se exceder os limites. Quando não houver CI configurado, mesma suíte roda localmente como gate pré merge.

**Racional**: Atende exigência do Princípio IV de "PR que toca o caminho crítico reportar impacto nessas métricas". Sem ferramenta paga.

**Alternativas consideradas**:
- **Lighthouse CI**: rejeitado por enquanto. Mais lento (60s+ por execução vs <10s no Playwright direto). Reavaliar quando houver mais features no caminho crítico.
- **WebPageTest**: rejeitado. Útil para análise pontual, não para gate automatizado.

## Resumo do orçamento técnico

| Item | Limite | Justificativa |
|------|--------|---------------|
| Bundle JS inicial (gzipped) | 80 KB | Mantém **LCP** ≤ 2.5s em Fast 3G. React 19 + ReactDOM ~45KB, restante para código do app. |
| Imagens iniciais (visíveis acima da dobra) | 21 | 3 hero + 3 carrosséis × 6 cards. Restante lazy. |
| Tarefa longa máxima | 50ms | Princípio IV exige scroll a 60fps sem long tasks. |
| Contraste mínimo texto | 4.5:1 | WCAG AA texto normal. |
| Contraste mínimo foco/UI | 3:1 | WCAG AA componentes e foco. |

Phase 0 concluído. Nenhum NEEDS CLARIFICATION pendente.
