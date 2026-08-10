# Contract: catalogService

Fonte única de dados mockados desta entrega. Implementa FR-011 (sem dependência externa) e FR-018 (latência e erro injetáveis).

## API pública

```ts
import { fetchHero, fetchCategory } from '@/services/catalogService';

await fetchHero({ latencyMs: 300 });
await fetchCategory('trending');
await fetchCategory('continue-watching', { forceError: true });
```

## Garantias

1. Toda chamada resolve uma `Promise<HeroFetchResult | CategoryFetchResult>`. **Nunca rejeita**, mesmo em erro simulado. Erros são representados via discriminated union (`status: 'error'`).
2. A latência simulada é determinística: `latencyMs` é o tempo exato em milissegundos antes do resolve, sem variação aleatória.
3. Os dados padrão (sem config) são estáveis entre chamadas: mesmas categorias, mesmas listas, mesmos posters. Permite snapshot tests.
4. Cada `Title.id` é único globalmente entre todas as categorias da mesma sessão.
5. O hero retorna no máximo 3 destaques. Categorias retornam 12 títulos por padrão.

## Versionamento

Contrato interno consumido apenas por hooks da UI. Mudanças seguem semver:
- **MAJOR**: alterar shape de retorno, remover função, renomear `CategoryId`.
- **MINOR**: adicionar campo opcional em `Title` ou `Category`, adicionar nova `CategoryId`.
- **PATCH**: ajustar mensagens de erro padrão, melhorar performance.

## Testes obrigatórios (TDD)

Testes a serem escritos ANTES da implementação:

- `fetchHero()` sem config retorna `success` com 3 highlights em ordem 0, 1, 2.
- `fetchHero({ forceError: true })` retorna `error` após `latencyMs`.
- `fetchHero({ forceEmpty: true })` retorna `empty`.
- `fetchHero({ count: 2 })` retorna `success` com 2 highlights.
- `fetchCategory('trending')` retorna `success` com 12 títulos.
- `fetchCategory('continue-watching', { titlesCount: 0 })` retorna `empty`.
- `fetchCategory('new-releases', { forceError: true, latencyMs: 0 })` retorna `error` imediatamente.
- `fetchCategory(id)` chamado N vezes retorna conteúdo idêntico (determinismo).
- Todos os `Title.id` retornados em uma sessão são únicos.
