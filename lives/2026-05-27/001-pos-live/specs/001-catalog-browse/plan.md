# Implementation Plan: Tela inicial do catálogo

**Branch**: `001-catalog-browse` | **Date**: 2026-05-27 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from [specs/001-catalog-browse/spec.md](./spec.md)

## Summary

Construir uma SPA de catálogo no estilo **Netflix** composta por hero rotativo com três destaques e três carrosséis horizontais por categoria. Caminho crítico precisa atingir **LCP** ≤ 2.5s, **INP** ≤ 200ms e rolagem a 60fps. Toda interação funciona por teclado, com conformidade **WCAG** nível AA validada por auditoria automatizada. Dados mockados são entregues por função geradora em runtime com latência e cenários de erro injetáveis por categoria, para reproduzir loading e erro de forma determinística.

A abordagem técnica é minimalista por princípio (YAGNI). React 19 + Vite + TypeScript com CSS Modules. Sem framework de estado global, sem CSS-in-JS, sem MSW. Testes em três camadas (unitário, componente, E2E) com TDD obrigatório para lógica de interação. Detalhe do título abre como overlay/modal acessível com gestão de foco, mas o conteúdo do overlay é renderizado por uma feature posterior.

## Technical Context

**Language/Version**: TypeScript 5.6 sobre Node 20 LTS.

**Primary Dependencies**:
- React 19.0 + React DOM 19.0
- Vite 6.0 (build e dev server)
- CSS Modules nativos via Vite (sem PostCSS plugins adicionais)

**Storage**: N/A nesta entrega. Dados de catálogo são gerados em runtime por função pura conforme FR-018. Nenhuma persistência cliente (localStorage, IndexedDB) ou servidor.

**Testing**:
- Vitest 2.x para testes unitários e de componente
- @testing-library/react 16 para interações de componente
- @testing-library/user-event 14 para simulação fiel de teclado
- axe-core 4 (via @axe-core/react) para auditoria automatizada de acessibilidade
- Playwright 1.49 para E2E de fluxo de teclado e medição de Web Vitals em ambiente real

**Target Platform**: Navegadores desktop modernos (Chrome 120+, Firefox 120+, Safari 17+, Edge 120+). Viewport primária 1440px. Suporte responsivo até 768px sem otimização dedicada para mobile.

**Project Type**: Single-page application (web-service não se aplica, é puramente frontend nesta entrega).

**Performance Goals**:
- **LCP** ≤ 2.5s em conexão simulada "Fast 3G" no Lighthouse
- **INP** ≤ 200ms para primeira interação após carregamento
- Rolagem horizontal de carrossel ≥ 60fps
- Sem tarefas longas > 50ms no thread principal durante rolagem

**Constraints**:
- Caminho crítico não pode incluir framework de UI além de React
- Imagens de poster servidas como AVIF com fallback WebP, lazy-load para tudo fora da viewport inicial
- Bundle JS inicial ≤ 80KB gzipped (medido em CI quando disponível)

**Scale/Scope**:
- 3 destaques no hero + 3 carrosséis × 12 títulos = 39 entidades em tela
- 6 cards visíveis por carrossel em viewport 1440px (FR-017)
- 21 imagens de poster no estado inicial (3 hero + 3×6 visíveis acima da dobra)

## Constitution Check

Gates derivados de [.specify/memory/constitution.md](../../.specify/memory/constitution.md) v1.0.0.

| Princípio | Status | Justificativa |
|-----------|--------|---------------|
| **I. Test-First** | PASS | Todo componente com interação ou estado (Hero, Carousel, Card, MockDataGenerator, OverlayController) recebe teste de comportamento ANTES da implementação. Componentes puramente visuais (Poster, Skeleton, EmptyState) marcados como isentos do ciclo RED-GREEN no Phase 1. Estratégia detalhada em [research.md](./research.md). |
| **II. Simplicidade & YAGNI** | PASS | Sem framework de estado global, sem CSS-in-JS, sem MSW, sem feature flags. Cada dependência adicional (axe-core, Playwright) tem requisito explícito da spec (SC-006 e SC-002/SC-003). Estrutura de pastas em camada única (sem `domain`/`infrastructure`) por haver apenas um consumidor. |
| **III. Versionamento Semântico** | PASS | Esta é a primeira entrega da SPA, versão inicial `0.1.0`. Não há API pública nem contrato externo a quebrar. Contratos internos de componentes documentados em [contracts/](./contracts/) seguem semver desde o primeiro release. |
| **IV. Performance & UX-First** | PASS | Metas explícitas em "Performance Goals" acima. Medição via Playwright + Web Vitals API no E2E (SC-002 e SC-003). Caminho crítico orçado em ≤80KB JS gzipped + 21 imagens AVIF com hint `fetchpriority="high"` apenas para o destaque visível do hero. Rolagem testada com Performance Observer no Playwright. |
| **V. Acessibilidade** | PASS | axe-core executa em todo teste de componente (gate de CI). Navegação por teclado tem suíte E2E dedicada (US3). `prefers-reduced-motion` testado via override do Playwright. Live region do hero (FR-019) validada por inspeção de DOM acessível. Contraste mínimo 4.5:1 para texto e 3:1 para foco/UI documentado em [contracts/visual-tokens.md](./contracts/visual-tokens.md). |
| **UI/Streaming Constraints** | PASS | Os quatro estados (loading/vazio/erro/sucesso) entregues por cada região através de um padrão `<DataRegion>` reutilizável documentado em [contracts/region-states.md](./contracts/region-states.md). Dados mockados atrás da camada testável `catalogService` (FR-018). |

**Resultado**: 6/6 gates passam. Nenhuma violação. Tabela "Complexity Tracking" vazia.

## Project Structure

### Documentation (this feature)

```text
specs/001-catalog-browse/
├── plan.md                          # Este arquivo
├── research.md                      # Phase 0
├── data-model.md                    # Phase 1
├── quickstart.md                    # Phase 1
├── contracts/                       # Phase 1
│   ├── catalog-service.md
│   ├── region-states.md
│   ├── overlay-controller.md
│   └── visual-tokens.md
├── checklists/
│   ├── requirements.md              # Gerado por /speckit.specify
│   └── accessibility.md             # Gerado por /speckit.checklist
└── tasks.md                         # Phase 2 (gerado por /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── main.tsx                         # Bootstrap React + monta App
├── App.tsx                          # Composição da tela inicial
├── components/
│   ├── Hero/
│   │   ├── Hero.tsx                 # Container do hero rotativo
│   │   ├── Hero.module.css
│   │   ├── HeroSlide.tsx            # Destaque individual
│   │   ├── HeroProgress.tsx         # Indicador de progresso + live region
│   │   └── useHeroRotation.ts       # Hook de rotação automática
│   ├── Carousel/
│   │   ├── Carousel.tsx             # Container do carrossel
│   │   ├── Carousel.module.css
│   │   ├── CarouselCard.tsx         # Card individual
│   │   └── useCarouselKeyboard.ts   # Hook de navegação por teclado
│   ├── DataRegion/
│   │   ├── DataRegion.tsx           # Wrapper de loading/vazio/erro/sucesso
│   │   ├── DataRegion.module.css
│   │   ├── LoadingState.tsx
│   │   ├── EmptyState.tsx
│   │   └── ErrorState.tsx
│   ├── Overlay/
│   │   ├── OverlayHost.tsx          # Container do modal de detalhe
│   │   ├── Overlay.module.css
│   │   └── useFocusTrap.ts          # Gestão de foco modal (FR-020)
│   └── primitives/
│       ├── Poster.tsx               # Imagem AVIF com fallback
│       └── VisuallyHidden.tsx       # Rótulos para tecnologia assistiva
├── services/
│   └── catalogService.ts            # Gerador de dados mockados (FR-018)
├── hooks/
│   ├── usePrefersReducedMotion.ts
│   └── useOverlayController.ts      # API de abertura/fechamento do overlay
├── styles/
│   ├── tokens.css                   # Variáveis de design (cores, espaços, contraste)
│   └── globals.css                  # Reset e estilos base
└── types/
    └── catalog.ts                   # Tipos compartilhados

tests/
├── unit/                            # Lógica pura (hooks, services)
├── component/                       # Componentes isolados (RTL + axe)
└── e2e/                             # Playwright (teclado, Web Vitals, prefers-reduced-motion)
```

**Structure Decision**: Single project SPA com pastas por feature de componente em `src/components/` e separação clara entre `components/`, `services/`, `hooks/` e `types/`. Justificativa: simplicidade (princípio II), facilita TDD por colocar testes próximos ao código sob teste e permite escalar para futuras features sem reorganização. Sem monorepo, sem backend, sem mobile nesta entrega.

## Complexity Tracking

Nenhuma violação de constituição. Tabela vazia conforme manda o template.
