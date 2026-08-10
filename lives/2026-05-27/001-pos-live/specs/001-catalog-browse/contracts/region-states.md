# Contract: DataRegion

Componente que padroniza os quatro estados obrigatórios (loading, vazio, erro, sucesso) por região. Atende FR-010 e SC-005.

## API

```tsx
<DataRegion
  label="Em alta"                  // Rótulo acessível (FR-024 implícito)
  state={fetchResult}              // CategoryFetchResult | HeroFetchResult
  loading={<CarouselSkeleton />}
  empty={<EmptyState category="Em alta" />}
  error={(reason) => <ErrorState message={reason} />}
  success={(data) => <Carousel category={data.category} />}
/>
```

## Garantias

1. Renderiza exatamente um dos quatro slots, baseado em `state.status`.
2. O slot é envolvido em uma `<section aria-label={label}>` para que cada região seja identificável por leitor de tela.
3. Durante `loading`, a região inclui `aria-busy="true"`.
4. Durante `error`, a região inclui `role="alert"` para anúncio imediato em leitor de tela.
5. Durante `empty`, a região inclui `role="status"` (anúncio educado).
6. Trocas de estado preservam altura do container quando viável, evitando layout shift que afetaria **CLS** e leitura de tela.

## Versionamento

- **MAJOR**: remover ou renomear slot, mudar shape de `state`.
- **MINOR**: adicionar slot novo opcional.
- **PATCH**: ajustar marcação semântica interna sem mudar API.

## Testes obrigatórios (TDD)

- Renderiza skeleton quando `state.status === 'loading'`.
- Renderiza empty quando `state.status === 'empty'`.
- Renderiza error com mensagem quando `state.status === 'error'`.
- Renderiza success com dados quando `state.status === 'success'`.
- `aria-busy="true"` presente apenas em loading.
- `role="alert"` presente apenas em error.
- `role="status"` presente apenas em empty.
- axe.run() retorna zero violações em cada um dos quatro estados.
