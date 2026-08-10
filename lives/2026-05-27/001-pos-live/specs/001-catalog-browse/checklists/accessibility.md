# Checklist de Qualidade: Acessibilidade e Navegação por Teclado

**Purpose**: Testes unitários da escrita dos requisitos da spec no domínio de acessibilidade e navegação por teclado. Avaliam a qualidade dos requisitos (completude, clareza, consistência, mensurabilidade e cobertura), não a implementação.

**Created**: 2026-05-27

**Feature**: [spec.md](../spec.md)

**Domain Focus**: Acessibilidade WCAG nível AA, navegação por teclado, foco visível, contraste, suporte a `prefers-reduced-motion`.

## Cobertura de teclado nos requisitos de interação

- [ ] CHK001 Todo requisito que descreve interação de mouse ou ponteiro também tem critério de aceite equivalente para teclado? [Completeness, FR-002 a FR-008]
- [ ] CHK002 O conjunto de teclas suportadas (Tab, setas, Enter, Esc) está explicitado para cada componente interativo (hero, carrossel, card)? [Clarity, FR-008]
- [ ] CHK003 A ordem de tabulação esperada entre hero e os três carrosséis está descrita como requisito testável? [Coverage, US3 Acceptance Scenario 1]
- [ ] CHK004 O comportamento de seta dentro de um carrossel ao chegar no primeiro ou no último card está definido (loop, parar, pular para o próximo carrossel)? [Coverage, gap em FR-008]
- [ ] CHK005 O comportamento de seta entre destaques do hero ao chegar no primeiro ou no último destaque está definido? [Coverage, gap em US1]
- [ ] CHK006 O efeito de pressionar Esc em cada contexto (hero focado, card focado, futuro overlay de detalhe) está descrito como requisito? [Coverage, FR-013 pendente]
- [ ] CHK007 Cada cenário Given/When/Then de interação tem uma variante explícita para teclado quando o original menciona mouse ou hover? [Consistency, US1 cenários 2/3, US2 cenários 3/4]

## Foco visível e gestão de foco

- [ ] CHK008 O requisito de indicador visual de foco define um critério mensurável (contraste mínimo, espessura, offset) ou apenas afirma "contraste suficiente"? [Measurability, FR-009]
- [ ] CHK009 Há requisito explícito sobre para onde o foco retorna após fechar um estado temporário (futuro overlay de detalhe acionado por Enter)? [Coverage, gap em FR-013]
- [ ] CHK010 Há requisito proibindo armadilhas de foco (focus traps) em regiões não modais como hero e carrosséis? [Coverage, ausência detectada]
- [ ] CHK011 O comportamento de foco quando um card é parcialmente ou totalmente fora da viewport horizontal do carrossel está definido (rolar para visível antes de focar)? [Clarity, FR-008 menciona "manter visível" sem critério]
- [ ] CHK012 A consistência do indicador de foco entre todos os tipos de elementos focáveis (destaque do hero, card de carrossel, controles do hero) está exigida por requisito? [Consistency, FR-009]

## Contraste e conformidade WCAG AA

- [ ] CHK013 O requisito de conformidade WCAG nível AA está quantificado por número da diretriz ou apenas referenciado de forma genérica? [Measurability, FR-009 e SC-006]
- [ ] CHK014 Há critério de contraste mínimo (4.5:1 para texto normal, 3:1 para texto grande e componentes) declarado no nível da spec? [Measurability, gap em FR-009]
- [ ] CHK015 A obrigação de contraste se aplica também ao indicador de foco (mínimo 3:1 contra fundo adjacente) e está separada do requisito de contraste de texto? [Completeness, gap em FR-009]
- [ ] CHK016 Há requisito para o estado de hover ou foco do card (título sobreposto ao poster) garantir contraste mínimo mesmo sobre imagens variáveis? [Coverage, ausência detectada em FR-007]
- [ ] CHK017 O critério de sucesso SC-006 ("zero violações AA no caminho crítico") define quais ferramentas ou regras qualificam como auditoria válida? [Measurability, SC-006]

## Mídia, movimento e `prefers-reduced-motion`

- [ ] CHK018 O requisito de respeitar `prefers-reduced-motion` está expresso de forma testável, com efeito observável definido (rotação automática desabilitada)? [Measurability, FR-012]
- [ ] CHK019 Além do hero, há requisito que cubra animações de rolagem do carrossel sob `prefers-reduced-motion` (rolagem instantânea ou suavizada reduzida)? [Coverage, gap em FR-012]
- [ ] CHK020 O comportamento de transições visuais do card ao receber foco ou hover (escala, brilho, deslocamento) está sujeito a `prefers-reduced-motion`? [Coverage, gap em FR-007]
- [ ] CHK021 A spec garante que não haverá autoplay de áudio nem reprodução de mídia inesperada nesta entrega, em alinhamento com critérios de acessibilidade de mídia? [Consistency, FR-016 trata escopo mas não vincula a WCAG]
- [ ] CHK022 Há requisito explícito de que indicadores de progresso de rotação do hero comuniquem o estado também de forma não exclusivamente visual (texto acessível, ARIA)? [Coverage, ausência detectada em US1]

## Estados degradados e comunicação assistiva

- [ ] CHK023 Os estados de loading, vazio e erro de cada região têm requisito sobre como são comunicados a tecnologia assistiva (live region, aria-busy, role=status)? [Coverage, ausência detectada em FR-010]
- [ ] CHK024 Cada uma das quatro regiões tem rótulo acessível (heading, aria-label) exigido por requisito para diferenciá las em leitor de tela? [Coverage, ausência detectada em FR-006]
- [ ] CHK025 O card de carrossel tem requisito de nome acessível que inclui pelo menos o título do conteúdo, mesmo quando o título textual só aparece visualmente no estado de hover ou foco? [Clarity, gap em FR-007]
- [ ] CHK026 Os destaques do hero têm requisito de nome acessível distinto da imagem (texto alternativo ou aria-label) descrito como obrigatório? [Coverage, ausência detectada em US1]

## Consistência terminológica

- [ ] CHK027 A spec usa o termo "WCAG nível AA" de forma consistente em FR-009 e SC-006, sem variações como "AA" sozinho ou "acessibilidade básica"? [Consistency, FR-009 e SC-006]
- [ ] CHK028 Os termos "foco" (teclado) e "hover" (cursor) estão diferenciados consistentemente em todos os cenários e requisitos, sem usar como sinônimos? [Consistency, FR-002 a FR-005, FR-007]
- [ ] CHK029 O termo "navegação por teclado" se refere sempre ao mesmo conjunto de teclas (Tab, setas, Enter, Esc) ao longo da spec? [Consistency, FR-008 e US3]

## Notas

- Itens marcados como "gap" ou "ausência detectada" indicam pontos em que a spec atual provavelmente não passaria no checklist e deve ser ajustada antes do `/speckit.plan`.
- O NEEDS CLARIFICATION pendente em FR-013 afeta diretamente CHK006 e CHK009 (gestão de foco no overlay de detalhe). Recomendado resolver primeiro via `/speckit.clarify`.
