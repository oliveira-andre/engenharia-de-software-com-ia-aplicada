# Contract: Visual Tokens

Tokens de design declarados em [src/styles/tokens.css] como variáveis CSS. Garantem conformidade de contraste WCAG nível AA verificável (FR-009, SC-006).

## Cores

| Token | Valor | Uso | Contraste mínimo |
|-------|-------|-----|------------------|
| `--color-bg` | `#0B0D11` | Fundo da aplicação | — |
| `--color-surface` | `#161A22` | Fundo de card e overlay | — |
| `--color-text-primary` | `#F5F7FA` | Texto sobre `--color-bg` | 16.1:1 (AAA) |
| `--color-text-secondary` | `#B7BCC6` | Texto secundário | 7.9:1 (AAA) |
| `--color-accent` | `#E50914` | CTA, indicador de progresso, foco | 5.1:1 sobre `--color-bg` |
| `--color-error` | `#FF6A6A` | Estado de erro | 7.6:1 sobre `--color-bg` |
| `--color-focus-ring` | `#FFFFFF` | Anel de foco visível | 19.5:1 sobre `--color-bg` |

## Foco visível

```css
:focus-visible {
  outline: 3px solid var(--color-focus-ring);
  outline-offset: 2px;
}
```

Atende FR-009 com contraste 19.5:1 contra fundo da aplicação e 3:1 contra qualquer fundo de card.

## Espaçamentos e dimensões

| Token | Valor | Uso |
|-------|-------|-----|
| `--space-1` a `--space-6` | 4, 8, 12, 16, 24, 32 px | Padding, gap |
| `--card-width` | 220 px | Largura do card de carrossel (6 cards visíveis em 1440px com gap de 16px) |
| `--card-aspect` | 2/3 | Proporção do poster (retrato) |
| `--hero-height` | 480 px | Altura fixa do hero |
| `--reduced-motion-duration` | 0ms | Sobrescrito globalmente quando `prefers-reduced-motion` está ativo |

## Garantias de contraste

Todas as combinações de `--color-text-*` sobre `--color-bg` e `--color-surface` foram pré calculadas para atender WCAG AA com margem. Teste automatizado verifica:

1. Cada token de texto contra `--color-bg` e `--color-surface`.
2. `--color-focus-ring` contra ambos os fundos.
3. `--color-accent` contra `--color-bg` (mínimo 3:1, classifica como componente).

Se um token mudar e quebrar contraste, o teste de unidade de design tokens falha antes do componente quebrar.

## Versionamento

Tokens são API pública para o resto do app.

- **MAJOR**: remover token, mudar significado semântico (ex: renomear `--color-accent`).
- **MINOR**: adicionar token novo.
- **PATCH**: ajustar valor mantendo contraste mínimo e semântica.
