# Phase 1: Data Model

Modelagem das entidades extraídas da spec (seção "Key Entities") em tipos TypeScript. Como esta entrega não tem persistência, o modelo é apenas em memória, retornado pelo `catalogService`.

## Entidades

### Title

Representa um título individual do catálogo. É a unidade base referenciada por `HeroHighlight` e por `CarouselCard`.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | `string` | Sim | Identificador único e estável dentro de uma sessão. |
| `title` | `string` | Sim | Título textual exibido no card ou no hero. |
| `posterUrl` | `string` | Sim | URL ou path do poster em formato AVIF. |
| `posterFallbackUrl` | `string` | Sim | URL do mesmo poster em WebP, para navegadores sem AVIF. |
| `year` | `number` | Não | Ano de lançamento. Não usado nesta tela, mas mantido para consumo do overlay de detalhe. |

**Validações**:
- `id` MUST ser único dentro da sessão.
- `posterUrl` e `posterFallbackUrl` MUST ser URLs ou paths não vazios.
- `title` MUST ter pelo menos um caractere visível.

### HeroHighlight

Representa um título promovido na rotação do hero.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `title` | `Title` | Sim | Título destacado. |
| `order` | `number` | Sim | Posição na sequência de rotação, 0-indexed. |
| `heroImageUrl` | `string` | Sim | Imagem em formato wide adequada ao hero (não confundir com poster vertical do card). |
| `heroImageFallbackUrl` | `string` | Sim | Fallback WebP da imagem do hero. |

**Validações**:
- `order` MUST ser sequencial sem buracos dentro do conjunto de destaques retornado.
- Total de destaques MUST estar entre 1 e 3 (cobre edge case "menos de três destaques" da spec).

### Category

Representa um agrupamento de títulos exibido como carrossel.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | `CategoryId` | Sim | Enum literal: `"trending"`, `"continue-watching"`, `"new-releases"`. |
| `displayName` | `string` | Sim | Nome em português exibido como heading: "Em alta", "Continuar assistindo", "Novidades". |
| `order` | `number` | Sim | Posição na lista de carrosséis. Determinístico: 0, 1, 2. |
| `titles` | `Title[]` | Sim | Lista ordenada de títulos da categoria. Pode ser vazia (estado vazio cobre FR-010). |

**Validações**:
- `id` MUST ser único entre as três categorias.
- Tamanho de `titles` é 0 (estado vazio) ou entre 1 e 24 (mockados, alvo padrão 12 conforme Assumptions da spec).

### CategoryFetchResult

Resultado de uma chamada ao `catalogService` por categoria. Estrutura discriminada para suportar os quatro estados de FR-010 sem ambiguidade.

```ts
type CategoryFetchResult =
  | { status: 'loading' }
  | { status: 'success'; category: Category }
  | { status: 'empty'; categoryId: CategoryId; displayName: string }
  | { status: 'error'; categoryId: CategoryId; displayName: string; reason: string };
```

**Transições válidas**:

```
loading ──► success
loading ──► empty
loading ──► error
```

Não há transição direta entre `success`, `empty` e `error` nesta entrega (sem refetch automático).

### HeroFetchResult

Análogo a `CategoryFetchResult`, mas para o hero.

```ts
type HeroFetchResult =
  | { status: 'loading' }
  | { status: 'success'; highlights: HeroHighlight[] }
  | { status: 'empty' }
  | { status: 'error'; reason: string };
```

`status: 'empty'` ocorre quando nenhum destaque está disponível. Comportamento: hero é ocultado e os carrosséis sobem para o topo. Coberto por edge case da spec.

## Configuração do catalogService

Atende FR-018. O serviço expõe duas funções e um tipo de configuração.

```ts
type CatalogServiceConfig = {
  hero?: {
    latencyMs?: number;     // Default: 200
    forceError?: boolean;   // Default: false
    forceEmpty?: boolean;   // Default: false
    count?: 1 | 2 | 3;      // Default: 3
  };
  categories?: {
    [K in CategoryId]?: {
      latencyMs?: number;     // Default: 200
      forceError?: boolean;   // Default: false
      forceEmpty?: boolean;   // Default: false
      titlesCount?: number;   // Default: 12
    };
  };
};

function fetchHero(config?: CatalogServiceConfig['hero']): Promise<HeroFetchResult>;

function fetchCategory(id: CategoryId, config?: CatalogServiceConfig['categories'][CategoryId]): Promise<CategoryFetchResult>;
```

**Comportamento**:
- `latencyMs` simula latência usando `setTimeout`. Permite testar estado `loading` de forma determinística.
- `forceError` faz a promise resolver para `{ status: 'error', ... }` após `latencyMs`. Não rejeita (promise rejeitada quebraria contrato de retorno tipado).
- `forceEmpty` resolve para `{ status: 'empty', ... }`.
- Sem nenhuma flag, gera os dados mockados padrão.

## Estado de UI derivado

Hooks de UI consomem `CategoryFetchResult` e `HeroFetchResult` para renderizar a região correta. Nenhum estado adicional é necessário, eliminando "shadow state" duplicado.

| Hook | Entrada | Saída |
|------|---------|-------|
| `useHero()` | `CatalogServiceConfig['hero']` | `HeroFetchResult` |
| `useCategory(id)` | `CategoryId` + config opcional | `CategoryFetchResult` |
| `useHeroRotation(highlights, paused)` | Lista e flag de pausa | Índice ativo + handler de avanço manual |
| `useCarouselKeyboard(items, options)` | Lista de cards + opções | Refs e handlers de teclado |
| `useOverlayController()` | — | `{ open(payload), close(), state }` |
| `useFocusTrap(ref, enabled)` | Ref do container | Side effects de gestão de foco |
| `usePrefersReducedMotion()` | — | `boolean` reativo |

Phase 1 (data model) concluído.
