# Contract: OverlayController

Controla abertura, fechamento e gestão de foco do overlay de detalhe. Atende FR-013 e FR-020.

## API

```tsx
const { open, close, state } = useOverlayController();

// Em um CarouselCard
<button onClick={() => open({ titleId: card.id, origin: cardRef })}>
  ...
</button>

// No topo da árvore
<OverlayHost state={state} onClose={close}>
  {/* Conteúdo renderizado por feature posterior */}
</OverlayHost>
```

## Tipos

```ts
type OverlayState =
  | { status: 'closed' }
  | { status: 'open'; titleId: string; origin: HTMLElement };

type OverlayController = {
  open(payload: { titleId: string; origin: HTMLElement }): void;
  close(): void;
  state: OverlayState;
};
```

## Garantias

1. Ao abrir: foco move para o primeiro elemento focável dentro do overlay dentro de uma `requestAnimationFrame` após mount.
2. Enquanto aberto, Tab e Shift+Tab circulam apenas entre elementos focáveis do overlay (focus trap).
3. Esc fecha o overlay e devolve foco para `origin`, mesmo se `origin` foi rolado para fora da viewport.
4. Clique fora do conteúdo do overlay também fecha (backdrop dismiss), mantendo o mesmo comportamento de retorno de foco.
5. `prefers-reduced-motion` ativo suprime animações de entrada e saída.
6. `body` recebe `aria-hidden="true"` em tudo que não é o overlay enquanto aberto (modal acessível).

## Versionamento

- **MAJOR**: mudar shape de `payload` ou `state`, remover gatilhos.
- **MINOR**: adicionar payload opcional, adicionar novo gatilho de abertura.
- **PATCH**: ajustar timing de retorno de foco sem mudar contrato.

## Testes obrigatórios (TDD)

- `open()` muda `state.status` para `'open'`.
- `close()` muda `state.status` para `'closed'`.
- Foco move para dentro do overlay ao abrir.
- Foco retorna para `origin` ao fechar.
- Tab dentro do overlay circula entre elementos do overlay (não vaza para fora).
- Esc fecha o overlay.
- Clique no backdrop fecha o overlay.
- `body` ganha `aria-hidden="true"` ao abrir e perde ao fechar.
- Sob `prefers-reduced-motion`, classes de animação não são aplicadas.
- axe.run() retorna zero violações com o overlay aberto.
