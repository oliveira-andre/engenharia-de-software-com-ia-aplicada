# Spec Driven Development

- 🗓️ 27 de maio de 2026

---

## Professores

- [**Aurélio Oliveira**](https://www.linkedin.com/in/aurelioolive/)
- [**Weslley Araújo**](https://www.linkedin.com/in/wellwelwel/)

---

## 📚 Material

- [Slide: Spec-Driven Development com Agentes de IA em Codebases Enterprise](./unipds-sdd-enterprise.pdf)
- [Exemplos no estado inicial (antes da live)](./000-pre-live/)
- [Exemplos no estado final (após a live)](./001-pos-live/)

## Dica extra da Live

Reaproveitando as instruções do repositório com qualquer **LLM**/**IDE**:

> Exemplo, criando e editando apenas o `CLAUDE.md`, então _espelhando_ para:

- **Copilot**: `.github/copilot-instructions.md`
- **Cursor**: `.cursorrules`
- **Windsurf**: `.windsurfrules`
- **Codex**, **Gemini**, etc.: `AGENTS.md`

```sh
mkdir -p .github && ln -sf ../CLAUDE.md .github/copilot-instructions.md
ln -sf CLAUDE.md .cursorrules
ln -sf CLAUDE.md .windsurfrules
ln -sf CLAUDE.md AGENTS.md
```

Isso cria atalhos (_symlinks_) que apontam para o `CLAUDE.md`. Assim, você mantém as instruções em um único arquivo e todas as ferramentas leem o mesmo conteúdo, sem precisar duplicar nada.

- Você pode escolher qualquer arquivo como base (por exemplo, o `AGENTS.md`) e espelhar para os demais.
