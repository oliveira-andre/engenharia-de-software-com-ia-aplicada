# Feature Specification: Tela inicial do catálogo

**Feature Branch**: `001-catalog-browse`

**Created**: 2026-05-27

**Status**: Draft

**Input**: User description: "Tela inicial do catálogo de filmes e séries com hero rotativo de três destaques e três carrosséis horizontais por categoria (Em alta, Continuar assistindo, Novidades). Navegação por teclado obrigatória, quatro estados por região, sem login, sem busca, sem reprodução real, dados mockados."

## Clarifications

### Session 2026-05-27

- Q: Como o detalhe do título deve ser aberto ao acionar Enter ou clique num card? → A: Overlay/modal sobre a tela atual. Card de origem permanece atrás, foco retorna ao card ao fechar com Esc.
- Q: Quantos cards aparecem visíveis simultaneamente em cada carrossel na viewport desktop padrão (1440px)? → A: Seis cards.
- Q: Qual a política de loop ao pressionar seta direita no último card ou seta esquerda no primeiro card de um carrossel? → A: Parar no extremo, sem loop. Tab continua movendo o foco para o próximo carrossel.
- Q: Como os dados mockados são entregues à tela para que os estados de loading e erro sejam reproduzíveis durante o desenvolvimento e testes? → A: Função geradora em runtime com latência simulada configurável e cenários de erro injetáveis por categoria.
- Q: Como o indicador de progresso da rotação do hero comunica o estado também a tecnologia assistiva? → A: Live region polite anunciando "Destaque X de Y" a cada troca, sem interromper leitura em curso.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Descoberta pelo hero rotativo (Priority: P1)

Ao abrir a tela inicial, o usuário vê imediatamente um destaque visual ocupando o topo da página com poster grande, título e indicador de progresso de rotação. O destaque avança automaticamente a cada oito segundos para o próximo entre três destaques. Quando o usuário move o foco ou o cursor para a área do hero, a rotação automática pausa e só retoma quando o foco ou cursor sai dessa área.

**Why this priority**: o hero é o ponto de entrada visual da tela e o principal vetor de descoberta dirigida pelo produto. Sem ele, a tela perde a função de recomendar destaques curados e vira apenas uma lista plana de catálogo.

**Independent Test**: pode ser testado isoladamente abrindo a tela e cronometrando a rotação automática, depois movendo foco para o hero e confirmando que a rotação pausa. Entrega valor mesmo sem os carrosséis, já que sozinho já é uma vitrine de três destaques.

**Acceptance Scenarios**:

1. **Given** a tela inicial recém carregada com três destaques disponíveis, **When** o usuário aguarda sem interagir, **Then** o destaque visível avança automaticamente para o próximo a cada oito segundos e retorna ao primeiro após o terceiro.
2. **Given** a rotação automática em andamento, **When** o usuário move o cursor para qualquer ponto da área do hero, **Then** a rotação pausa e permanece pausada enquanto o cursor estiver sobre a área.
3. **Given** a rotação automática em andamento, **When** o usuário move o foco do teclado para qualquer elemento dentro do hero, **Then** a rotação pausa e permanece pausada enquanto o foco estiver dentro do hero.
4. **Given** a rotação pausada por foco ou hover, **When** o foco ou cursor sai da área do hero, **Then** a rotação retoma a contagem de oito segundos a partir do destaque atualmente visível.

---

### User Story 2 - Navegação por categorias em carrosséis (Priority: P1)

Abaixo do hero, o usuário encontra três carrosséis horizontais identificados pelas categorias Em alta, Continuar assistindo e Novidades. Cada carrossel apresenta uma fileira de cards com poster do título. Ao receber foco ou hover em um card, o título do conteúdo aparece junto ao poster. O usuário pode rolar horizontalmente cada carrossel usando teclado ou interação de ponteiro.

**Why this priority**: os carrosséis são a forma como o usuário explora a biblioteca completa por categorias. Sem eles, o usuário só consegue interagir com os três destaques do hero, o que não caracteriza um catálogo.

**Independent Test**: pode ser testado isoladamente colocando dados mockados nas três categorias e validando que cada carrossel renderiza cards, exibe título no foco ou hover e permite navegação horizontal por teclado.

**Acceptance Scenarios**:

1. **Given** a tela inicial carregada com itens em todas as três categorias, **When** o usuário observa a região abaixo do hero, **Then** vê três carrosséis nomeados Em alta, Continuar assistindo e Novidades, cada um com sua fileira de cards.
2. **Given** o usuário com foco em um card de um carrossel, **When** o usuário pressiona seta para a direita, **Then** o foco move para o próximo card do mesmo carrossel e o carrossel rola horizontalmente o suficiente para manter o card focado visível.
3. **Given** o usuário com hover sobre um card, **When** o cursor permanece sobre o card, **Then** o título do conteúdo é exibido junto ao poster.
4. **Given** o usuário com foco em um card, **When** o card recebe foco, **Then** o título do conteúdo é exibido junto ao poster mesmo sem hover de cursor.

---

### User Story 3 - Navegação completa por teclado (Priority: P1)

O usuário consegue percorrer toda a tela sem usar mouse ou touch. Usa Tab para alternar entre o hero e cada carrossel, setas para navegar entre destaques do hero e entre cards de um carrossel, Enter para acionar o destaque ou card focado e Esc para sair de estados modais ou recolher menus contextuais que venham a existir.

**Why this priority**: navegação por teclado é princípio constitucional não negociável (Princípio V) e requisito de acessibilidade. Sem ela, a tela falha o Constitution Check do `/speckit.plan` e não pode avançar.

**Independent Test**: pode ser testado desconectando o mouse e validando que toda interação possível com mouse também é possível com teclado, incluindo identificar visualmente qual elemento está focado a qualquer momento.

**Acceptance Scenarios**:

1. **Given** a tela inicial carregada, **When** o usuário pressiona Tab a partir do topo da página, **Then** o foco entra no hero e em seguida percorre cada carrossel na ordem em que aparecem na tela.
2. **Given** o foco em um destaque do hero, **When** o usuário pressiona seta esquerda ou direita, **Then** o foco move para o destaque adjacente e a rotação automática continua pausada.
3. **Given** qualquer elemento focável da tela, **When** o elemento recebe foco, **Then** apresenta indicador visual de foco com contraste suficiente para ser percebido por usuários com baixa visão.
4. **Given** o foco em um card de carrossel, **When** o usuário pressiona Enter, **Then** o sistema registra a intenção de abrir o detalhe daquele título.

---

### User Story 4 - Estados de loading, vazio, erro e sucesso (Priority: P2)

Cada uma das quatro regiões da tela (hero e três carrosséis) trata explicitamente quatro estados. Loading enquanto os dados são obtidos. Vazio quando a categoria não tem itens. Erro quando a obtenção falha. Sucesso quando há dados para exibir.

**Why this priority**: estados degradados são frequentemente esquecidos e provocam telas quebradas ou em branco. Tratá los explicitamente é exigência constitucional para qualquer feature de UI neste projeto.

**Independent Test**: pode ser testado simulando cada um dos quatro estados em cada uma das quatro regiões e validando que cada combinação apresenta tratamento visual adequado e sem regressão nas outras regiões.

**Acceptance Scenarios**:

1. **Given** uma das categorias sem itens, **When** o carrossel correspondente é renderizado, **Then** apresenta mensagem de estado vazio compatível com a categoria, em vez de mostrar um carrossel sem cards.
2. **Given** falha ao obter os dados de uma categoria, **When** a tela termina o carregamento, **Then** o carrossel correspondente apresenta estado de erro com mensagem clara e as outras regiões continuam funcionais.
3. **Given** a tela em carregamento inicial, **When** os dados ainda não chegaram, **Then** cada região apresenta indicador de loading próprio sem bloquear a renderização das demais.
4. **Given** todos os dados disponíveis, **When** a tela termina o carregamento, **Then** todas as quatro regiões apresentam seu estado de sucesso simultaneamente.

---

### Edge Cases

- O que acontece quando há menos de três destaques disponíveis para o hero? A rotação roda apenas entre os destaques existentes e indicador de progresso reflete o total real.
- Como o sistema trata um usuário que navega muito rápido entre cards antes da imagem do poster carregar? Cada card mostra placeholder de imagem até a imagem estar disponível, mantendo a área do card estável.
- O que acontece quando o usuário define `prefers-reduced-motion` no sistema? A rotação automática do hero é desabilitada e o avanço passa a ser exclusivamente manual.
- Como a tela se comporta em viewport reduzida ao ponto de não caber seis cards visíveis em cada carrossel? O carrossel reduz proporcionalmente a quantidade visível (cinco, quatro, três, dois) mas mantém navegação horizontal funcional.
- O que acontece ao pressionar seta direita no último card de um carrossel? O foco permanece no card atual e nenhuma rolagem adicional ocorre. O usuário precisa pressionar Tab para mover o foco para o próximo carrossel.
- O que acontece quando a obtenção de dados de uma categoria demora muito mais que as outras? Cada região tem seu próprio loading independente, então o usuário pode começar a interagir com as regiões que já carregaram.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A tela MUST apresentar uma região superior chamada hero contendo até três destaques que se alternam automaticamente.
- **FR-002**: A rotação automática do hero MUST avançar para o próximo destaque a cada oito segundos enquanto não houver foco ou hover sobre a região do hero.
- **FR-003**: A rotação automática do hero MUST pausar imediatamente ao receber foco de teclado em qualquer elemento dentro do hero.
- **FR-004**: A rotação automática do hero MUST pausar imediatamente ao receber hover de cursor sobre a área do hero.
- **FR-005**: A rotação automática do hero MUST retomar quando foco e hover saírem da área, reiniciando a contagem de oito segundos a partir do destaque visível no momento.
- **FR-006**: A tela MUST apresentar três carrosséis horizontais identificados como Em alta, Continuar assistindo e Novidades, na ordem listada, abaixo do hero.
- **FR-007**: Cada card de carrossel MUST exibir o poster do título permanentemente e o título textual somente no estado de foco ou hover.
- **FR-008**: Toda interação possível com mouse MUST estar disponível também via teclado, incluindo navegação entre destaques do hero, navegação entre cards de carrossel, acionamento de destaque ou card e saída de estados temporários. Ao pressionar seta direita no último card ou seta esquerda no primeiro card de um carrossel, o foco MUST permanecer no card atual sem loop. O usuário avança para o próximo carrossel usando Tab.
- **FR-009**: Cada elemento focável MUST apresentar indicador visual de foco com contraste suficiente para conformidade WCAG nível AA.
- **FR-010**: Cada uma das quatro regiões da tela (hero e três carrosséis) MUST tratar explicitamente os estados de loading, vazio, erro e sucesso de forma independente das demais.
- **FR-011**: A tela MUST consumir dados mockados de catálogo, sem dependência de serviço externo para esta entrega.
- **FR-012**: A tela MUST respeitar `prefers-reduced-motion` desabilitando a rotação automática do hero quando a preferência estiver ativa.
- **FR-013**: A tela MUST abrir o detalhe de um título como overlay/modal sobre a tela atual ao receber Enter ou clique sobre um card ou destaque. A tela inicial permanece montada atrás do overlay. Ao fechar o overlay com Esc ou interação equivalente, o foco do teclado MUST retornar ao card ou destaque que originou a abertura. A renderização do conteúdo do overlay em si está fora desta feature, mas o contrato de abertura, fechamento e retorno de foco está dentro.
- **FR-014**: A tela MUST NOT exigir autenticação para qualquer interação descrita aqui.
- **FR-015**: A tela MUST NOT incluir funcionalidade de busca textual nesta entrega.
- **FR-016**: A tela MUST NOT incluir reprodução real de mídia nesta entrega, nem mesmo preview silencioso.
- **FR-017**: Cada carrossel MUST exibir exatamente seis cards visíveis simultaneamente na viewport desktop padrão (largura 1440px), reduzindo proporcionalmente em viewports menores sem perda de navegação horizontal.
- **FR-018**: Os dados mockados MUST ser entregues por uma função geradora em runtime que aceita configuração de latência simulada por categoria (em milissegundos) e cenário de erro injetável por categoria, permitindo reproduzir loading e erro de forma determinística durante desenvolvimento e testes.
- **FR-019**: A região do hero MUST anunciar a troca de destaque para tecnologia assistiva por meio de uma live region polite, com mensagem no formato "Destaque X de Y" a cada transição, sem interromper leitura em curso.
- **FR-020**: O overlay de detalhe acionado por FR-013 MUST gerenciar foco como modal acessível, prendendo o foco do teclado dentro do overlay enquanto estiver aberto e devolvendo o foco ao elemento de origem ao fechar.
- **FR-021**: A rolagem horizontal disparada por seta de teclado dentro de um carrossel MUST ser instantânea quando `prefers-reduced-motion` estiver ativo, suprimindo qualquer animação de transição.

### Key Entities

- **Destaque do hero**: representa um título promovido na vitrine principal. Atributos relevantes: título, imagem de destaque grande, posição na sequência de rotação, referência para o título no catálogo.
- **Categoria**: representa um agrupamento de títulos exibido como carrossel. Atributos relevantes: nome de exibição (Em alta, Continuar assistindo, Novidades), ordem de aparição na tela, lista ordenada de títulos.
- **Card de título**: representa um item dentro de um carrossel. Atributos relevantes: título textual, imagem de poster, referência para o título completo no catálogo.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O usuário consegue mover o foco do teclado a partir do topo da página até qualquer card visível de qualquer carrossel em até dois segundos.
- **SC-002**: A primeira interação do usuário após o carregamento inicial responde em menos de duzentos milissegundos entre a ação e o retorno visual perceptível.
- **SC-003**: Em conexão simulada de qualidade média, o primeiro conteúdo significativo da tela aparece em até dois segundos e meio após a navegação para a tela.
- **SC-004**: Cem por cento das interações descritas nos requisitos funcionais são executáveis usando apenas teclado, validado por auditoria manual com Tab, setas, Enter e Esc.
- **SC-005**: Cem por cento das quatro regiões da tela tratam os quatro estados de loading, vazio, erro e sucesso, validado por inspeção visual e por testes que simulam cada combinação.
- **SC-006**: Auditoria automatizada de acessibilidade reporta zero violações de nível AA do WCAG no caminho crítico da tela.
- **SC-007**: Rolagem horizontal de qualquer carrossel mantém ao menos cinquenta quadros por segundo, sem tarefas longas acima de cinquenta milissegundos no thread principal.

## Assumptions

- Cada carrossel recebe uma lista mockada de doze títulos por padrão, suficiente para validar rolagem horizontal com seis cards visíveis e seis adicionais para rolar.
- A categoria Continuar assistindo, por não haver autenticação, é apresentada como uma categoria normal com itens mockados pré definidos, sem persistência de progresso real entre sessões.
- Desktop é o alvo primário de viewport. Adaptações para mobile e tablet ficam fora desta feature e podem ser adicionadas em entrega futura sem reabrir a spec.
- A imagem de poster de cada título é uma única imagem estática mockada por enquanto, sem variantes responsivas ou tratamento de fallback além de placeholder durante o carregamento.
- O conteúdo do detalhe de um título (sinopse, elenco, ano, botões) é renderizado por outra feature. Esta feature implementa o contêiner de overlay, o gatilho de abertura por card ou destaque, o fechamento por Esc e o retorno de foco ao elemento de origem.
- Internacionalização não está no escopo desta entrega. Toda string visível ao usuário é em português.
- Métricas de performance (LCP, INP, taxa de quadros) são medidas localmente nesta entrega. Integração com pipeline de observabilidade contínua é responsabilidade de uma feature posterior.

[](./PRD.md)