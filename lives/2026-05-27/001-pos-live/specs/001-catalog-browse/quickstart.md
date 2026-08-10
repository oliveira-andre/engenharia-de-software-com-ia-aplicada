# Quickstart

Instruções para rodar a tela inicial localmente após a implementação. Documento alimentado pelo `/speckit.plan` e usado por `/speckit.tasks` para gerar tarefas de bootstrap.

## Pré requisitos

- Node 20 LTS
- pnpm 9 (gerenciador escolhido por simplicidade)

## Setup inicial (a ser executado pelas tarefas geradas)

```bash
pnpm install
pnpm dev
```

A SPA fica disponível em `http://localhost:5173`.

## Scripts

```bash
pnpm dev              # Vite dev server com HMR
pnpm build            # Build de produção em dist/
pnpm preview          # Serve dist/ localmente
pnpm test             # Vitest (unitário + componente, inclui axe-core)
pnpm test:watch       # Vitest modo watch
pnpm test:e2e         # Playwright (teclado, Web Vitals, prefers-reduced-motion)
pnpm typecheck        # tsc --noEmit
pnpm lint             # ESLint
```

## Como reproduzir cada estado em dev

A tela aceita query params para forçar estados específicos do `catalogService`:

| URL | Efeito |
|-----|--------|
| `?hero=loading` | Hero permanece em loading por 5 segundos |
| `?hero=empty` | Hero retorna empty (hero some, carrosséis sobem) |
| `?hero=error` | Hero retorna error |
| `?category=trending&state=empty` | Carrossel "Em alta" vazio |
| `?category=continue-watching&state=error` | Carrossel "Continuar assistindo" com erro |
| `?reduce-motion=force` | Override de `prefers-reduced-motion` para dev |

Útil para validar visualmente os 16 estados possíveis (4 estados × 4 regiões) sem mexer em DevTools.

## Como medir Web Vitals localmente

```bash
pnpm test:e2e -- --grep "Web Vitals"
```

O teste imprime LCP e INP no terminal e falha se exceder os limites do plano.

## Como auditar acessibilidade

axe-core roda em todo teste de componente automaticamente. Para auditoria manual:

```bash
pnpm test -- --grep "axe"
```

E para auditoria via Playwright em ambiente real:

```bash
pnpm test:e2e -- --grep "accessibility"
```
